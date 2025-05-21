// Una policy para adjuntar la id del creador como propiedad del objeto creado (ej: device)

const deviceKinds = require("../models/deviceKinds.json");

module.exports = async function (req, res, proceed) {
  const kindTag = req.body.kind;
  const kind = _.findWhere(deviceKinds, { tag: kindTag });
  req.body.status = kind.status;
  req.body.plan = kind.plan;
  console.log(req.body.port);
  return proceed();
};
