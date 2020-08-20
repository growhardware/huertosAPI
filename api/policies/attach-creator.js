// Una policy para adjuntar la id del creador como propiedad del objeto creado (ej: device)

module.exports = async function (req, res, proceed) {

  req.body.admin = req.session.userId;
  return proceed();

};
