/**
 * is-admin-of-this
 *
 * A policy...
 *
 */
module.exports = async function (req, res, proceed) {

  let user = await User.findOne({id: req.session.userId}).populate('managing');
  const isAdmin = user.managing.find(e => e.id === req.body.id);

  if (isAdmin) {
    return proceed();
  }

  //--•
  // Otherwise...
  return res.unauthorized();

};
