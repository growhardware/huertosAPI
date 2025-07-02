const { GridFSBucket, ObjectId } = require('mongodb');
const { Readable } = require('stream');

module.exports = {
  // 📤 POST /device/post-photo
  'post-photo': async function (req, res) {
    try {
      const deviceId = req.query.device || req.body.device_id || 'unknown_device';
      const phase = req.body.phase || 'unknown';

      // Captura el binario como Buffer
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', async () => {
        const buffer = Buffer.concat(chunks);

        const db = sails.getDatastore().manager;
        const bucket = new GridFSBucket(db, { bucketName: 'photos' });

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        const filename = `photo_${deviceId}_${Date.now()}.jpg`;

        const uploadStream = bucket.openUploadStream(filename, {
          contentType: 'image/jpeg',
          metadata: {
            device: deviceId,
            phase: phase,
            timestamp: Date.now()
          }
        });

        stream.pipe(uploadStream)
          .on('error', (err) => {
            sails.log.error('❌ Error al guardar en GridFS:', err);
            return res.serverError({ error: 'Error al guardar imagen' });
          })
          .on('finish', () => {
            sails.log.info(`📸 Imagen guardada en GridFS como ${filename}`);
            return res.json({
              status: 'ok',
              fileId: uploadStream.id,
              device: deviceId,
              filename
            });
          });
      });
    } catch (err) {
      sails.log.error('Error general en post-photo:', err);
      return res.serverError({ error: 'Fallo inesperado en post-photo' });
    }
  },

  // 📥 GET /device/get-photo
  'get-photo': async function (req, res) {
    try {
      const db = sails.getDatastore().manager;
      const bucket = new GridFSBucket(db, { bucketName: 'photos' });

      const device = req.query.device;
      const since = req.query.since ? parseInt(req.query.since) : null;
      const until = req.query.until ? parseInt(req.query.until) : null;
      const fileId = req.query.fileId;

      if (fileId) {
        // 🔁 Devuelve el binario directamente
        const _id = new ObjectId(fileId);
        const downloadStream = bucket.openDownloadStream(_id);
        res.set('Content-Type', 'image/jpeg');
        return downloadStream.pipe(res);
      }

      // 🎯 Construcción de filtro
      const filter = {};
      if (device) filter['metadata.device'] = device;
      if (since || until) filter['metadata.timestamp'] = {};
      if (since) filter['metadata.timestamp'].$gte = since;
      if (until) filter['metadata.timestamp'].$lte = until;

      const files = await db.collection('photos.files')
        .find(filter)
        .sort({ uploadDate: -1 })
        .limit(10)
        .toArray();

      if (!files.length) {
        return res.status(404).json({ message: 'No se encontraron imágenes' });
      }

      // 🧾 Lista de metadatos sin binario
      return res.json(files.map(f => ({
        fileId: f._id,
        filename: f.filename,
        device: f.metadata?.device,
        timestamp: f.metadata?.timestamp,
        phase: f.metadata?.phase,
        contentType: f.contentType,
        size: f.length
      })));
    } catch (err) {
      sails.log.error('Error en get-photo:', err);
      return res.serverError({ error: 'Fallo al consultar fotos' });
    }
  }
};


// | Acción           | Método | Ruta                                               | Detalles              |
// | ---------------- | ------ | -------------------------------------------------- | --------------------- |
// | Subir foto       | `POST` | `/device/post-photo?device=propagation_001`        | Body = binario JPEG   |
// | Ver últimas      | `GET`  | `/device/get-photo?device=propagation_001`         | Devuelve lista        |
// | Ver por rango    | `GET`  | `/device/get-photo?device=...&since=...&until=...` | Timestamp UNIX        |
// | Descargar imagen | `GET`  | `/device/get-photo?fileId=...`                     | Devuelve `image/jpeg` |
