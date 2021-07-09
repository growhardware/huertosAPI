
/**
 * device/get-my-devices.js
 *
 * Get my devices.
 */
module.exports = async function getMyDevices(req, res) {
  let userId = req.session.userId;
  let user = await User.findOne( {id: userId} ).populate('managing');
  const devIds = user['managing'].map( d => d.id );
  let devices = await Device.find( {id: devIds} ).populate('history');
  let selected = req.body.devices;
  if( Array.isArray(selected) ){
    devices = devices.filter( dev => selected.includes(dev.alias) );
  }
  console.log(devices);
  if(req.isSocket){
    let ids = devices.map( d => d.id );
    Device.subscribe( req, ids );
  }

  return res.json(devices);
};
