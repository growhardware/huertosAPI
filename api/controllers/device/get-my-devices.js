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
  let userId = req.session.userId
  let query = await User.find({where: {id : userId}}).populate('managing')
  let subQuery = query[0]
  let devices = subQuery['managing']
  return res.json(devices);
};
