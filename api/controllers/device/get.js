/**
 * Module dependencies
 */

// ...


/**
 * device/get-my-devices.js
 *
 * Get my devices.
 */
module.exports = async function getMyDevices(req, res) {
  let userId = req.session.userId;
  let user = await User.findOne({id : userId}).populate('managing');
  // TO DO: suscribir unicamente a los id de los dispositivos cuyos alias vengan en 
    // en el mensaje, si no viene nada ahi si, devolvemos todos los del usuario:
  let devices = user['managing'];
  let selected = req.body.devices;
  if( Array.isArray(selected) ){
    devices = devices.filter( dev => selected.includes(dev.alias) );
  }
  if(req.isSocket){
    let ids = _.pluck(devices, 'id');
    Device.subscribe(req, ids);
  }
  return res.json(devices);
};
