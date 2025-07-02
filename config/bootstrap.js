// /**
//  * Seed Function
//  * (sails.config.bootstrap)
//  *
//  * A function that runs just before your Sails app gets lifted.
//  * > Need more flexibility?  You can also create a hook.
//  *
//  * For more information on seeding your app with fake data, check out:
//  * https://sailsjs.com/config/bootstrap
//  */

// module.exports.bootstrap = async function() {
//   console.log('mongo URL ES> ', process.env.MONGO_URL);
//   // Import dependencies
//   var path = require('path');

//   // This bootstrap version indicates what version of fake data we're dealing with here.
//   var HARD_CODED_DATA_VERSION = 0;

//   // This path indicates where to store/look for the JSON file that tracks the "last run bootstrap info"
//   // locally on this development computer (if we happen to be on a development computer).
//   var bootstrapLastRunInfoPath = path.resolve(sails.config.appPath, '.tmp/bootstrap-version.json');

//   // Whether or not to continue doing the stuff in this file (i.e. wiping and regenerating data)
//   // depends on some factors:
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//   // If the hard-coded data version has been incremented, or we're being forced
//   // (i.e. `--drop` or `--environment=test` was set), then run the meat of this
//   // bootstrap script to wipe all existing data and rebuild hard-coded data.
//   if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
//     // If this is _actually_ a production environment (real or simulated), or we have
//     // `migrate: safe` enabled, then prevent accidentally removing all data!
//     if (process.env.NODE_ENV==='production' || sails.config.models.migrate === 'safe') {
//       sails.log('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "'+sails.config.environment+'" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
//       return;
//     }//•

//     // Compare bootstrap version from code base to the version that was last run
//     var lastRunBootstrapInfo = await sails.helpers.fs.readJson(bootstrapLastRunInfoPath)
//     .tolerate('doesNotExist');// (it's ok if the file doesn't exist yet-- just keep going.)

//     if (lastRunBootstrapInfo && lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION) {
//       sails.log('Skipping v'+HARD_CODED_DATA_VERSION+' bootstrap script...  (because it\'s already been run)');
//       sails.log('(last run on this computer: @ '+(new Date(lastRunBootstrapInfo.lastRunAt))+')');
//       return;
//     }//•

//     sails.log('Running v'+HARD_CODED_DATA_VERSION+' bootstrap script...  ('+(lastRunBootstrapInfo ? 'before this, the last time the bootstrap ran on this computer was for v'+lastRunBootstrapInfo.lastRunVersion+' @ '+(new Date(lastRunBootstrapInfo.lastRunAt)) : 'looks like this is the first time the bootstrap has run on this computer')+')');
//   }
//   else {
//     sails.log('Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)');
//   }

//   // Since the hard-coded data version has been incremented, and we're running in
//   // a "throwaway data" environment, delete all records from all models.
//   for (let identity in sails.models) {
//     await sails.models[identity].destroy({});
//   }//∞

//   // By convention, this is a good place to set up fake data during development.
//   await User.createEach([
//     { emailAddress: 'admin@example.com', fullName: 'Ryan Dahl', isSuperAdmin: true, password: await sails.helpers.passwords.hashPassword('abc123') },
//   ]);

//   // Save new bootstrap version
//   await sails.helpers.fs.writeJson.with({
//     destination: bootstrapLastRunInfoPath,
//     json: {
//       lastRunVersion: HARD_CODED_DATA_VERSION,
//       lastRunAt: Date.now()
//     },
//     force: true
//   })
//   .tolerate((err)=>{
//     sails.log.warn('For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or, if you are in production, a limitation of your hosting provider related to `pwd`.  As a workaround, try updating app.js to explicitly pass in `appPath: __dirname` instead of relying on `chdir`.  Current sails.config.appPath: `'+sails.config.appPath+'`.  Full error details: '+err.stack+'\n\n(Proceeding anyway this time...)');
//   });

// };

/**
 * Bootstrap Configuration
 * (sails.config.bootstrap)
 *
 * Configuración que se ejecuta al iniciar la aplicación Sails.js
 * - Conexión a MQTT
 * - Inicialización de datos
 * - Configuraciones iniciales
 */

const path = require('path');
const mqtt = require('mqtt');

module.exports.bootstrap = async function(done) {
  console.log('🔧 ENV:', process.env.NODE_ENV);
  console.log('🔗 MONGO_URL:', process.env.MONGO_URL);
  // 1. Mostrar URL de MongoDB (para debug)
  sails.log.info('Mongo URL:', process.env.MONGO_URL);

  // 2. Configuración MQTT (lo hacemos primero para que esté disponible cuanto antes)
  // await setupMQTTConnection();
  await setupHiveMQConnection();

  // 3. Lógica de inicialización de datos
  await initializeData();

  return done();
};

// ============ Funciones auxiliares ============

/**
 * Configuración MQTT con HiveMQ
 */

async function setupHiveMQConnection() {
  const mqttClient = mqtt.connect('mqtt://broker.hivemq.com', {
    clientId: 'sails-server-' + Math.random().toString(16).substr(2, 8),
    protocolVersion: 4 // MQTT v3.1.1 para ESP32
  });

  mqttClient.on('connect', () => {
    sails.log.info('✅ Conectado a HiveMQ Public Broker');
  });

  mqttClient.on('error', (err) => {
    sails.log.error('❌ Error MQTT:', err);
  });

  sails.mqttClient = mqttClient;
}
/**
 * Configura la conexión MQTT con test.mosquitto.org
 */
// async function setupMQTTConnection() {
//   try {
//     const mqttClient = mqtt.connect('mqtt://test.mosquitto.org', {
//       username: 'rw',
//       password: 'readwrite',
//       clientId: 'sails-server-' + Math.random().toString(16).substr(2, 8),
//       protocolVersion: 4, // MQTT v3.1.1
//       reconnectPeriod: 5000 // Reconectar cada 5 segundos si falla
//     });

//     // Manejadores de eventos
//     mqttClient.on('connect', () => {
//       sails.log.info('✅ Conexión MQTT establecida con test.mosquitto.org');
//     });

//     mqttClient.on('error', (err) => {
//       sails.log.error('❌ Error MQTT:', err);
//     });

//     // Guardar el cliente en sails para uso global
//     sails.mqttClient = mqttClient;

//   } catch (err) {
//     sails.log.error('Error al configurar MQTT:', err);
//   }
// }

/**
 * Inicializa los datos de la aplicación
 */
async function initializeData() {
  const HARD_CODED_DATA_VERSION = 0;
  const bootstrapLastRunInfoPath = path.resolve(sails.config.appPath, '.tmp/bootstrap-version.json');

  // Verificar si debemos ejecutar la inicialización
  if (!(await shouldRunInitialization(HARD_CODED_DATA_VERSION, bootstrapLastRunInfoPath))) {
    return;
  }

  try {
    // Limpiar datos existentes si es necesario
    await clearExistingData();

    // Crear datos iniciales
    await createInitialUsers();

    // Guardar información de la ejecución
    await saveBootstrapInfo(HARD_CODED_DATA_VERSION, bootstrapLastRunInfoPath);

  } catch (err) {
    sails.log.error('Error durante la inicialización:', err);
  }
}

/**
 * Determina si se debe ejecutar la inicialización
 */
async function shouldRunInitialization(version, infoPath) {
  if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
    if (process.env.NODE_ENV === 'production' || sails.config.models.migrate === 'safe') {
      sails.log('Skipping bootstrap to avoid data loss in production/safe mode...');
      return false;
    }

    const lastRunInfo = await sails.helpers.fs.readJson(infoPath).tolerate('doesNotExist');
    
    if (lastRunInfo && lastRunInfo.lastRunVersion === version) {
      sails.log(`Skipping v${version} bootstrap (already run on ${new Date(lastRunInfo.lastRunAt)})`);
      return false;
    }
  }

  sails.log('Running bootstrap script...');
  return true;
}

/**
 * Limpia los datos existentes
 */
async function clearExistingData() {
  for (let identity in sails.models) {
    await sails.models[identity].destroy({});
  }
}

/**
 * Crea usuarios iniciales
 */
async function createInitialUsers() {
  await User.createEach([
    { 
      emailAddress: 'admin@example.com', 
      fullName: 'Ryan Dahl', 
      isSuperAdmin: true, 
      password: await sails.helpers.passwords.hashPassword('abc123') 
    }
  ]);
}

/**
 * Guarda información de la ejecución del bootstrap
 */
async function saveBootstrapInfo(version, infoPath) {
  await sails.helpers.fs.writeJson.with({
    destination: infoPath,
    json: {
      lastRunVersion: version,
      lastRunAt: Date.now()
    },
    force: true
  }).tolerate((err) => {
    sails.log.warn('Could not write bootstrap version file:', err);
  });
}