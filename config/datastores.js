/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {
  /***************************************************************************
   *                                                                          *
   * Your app's default datastore.                                            *
   *                                                                          *
   * Sails apps read and write to local disk by default, using a built-in     *
   * database adapter called `sails-disk`.  This feature is purely for        *
   * convenience during development; since `sails-disk` is not designed for   *
   * use in a production environment.                                         *
   *                                                                          *
   * To use a different db _in development_, follow the directions below.     *
   * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
   *                                                                          *
   * (For production configuration, see `config/env/production.js`.)          *
   *                                                                          *
   ***************************************************************************/

  default: {
    /***************************************************************************
     *                                                                          *
     * Want to use a different database during development?                     *
     *                                                                          *
     * 1. Choose an adapter:                                                    *
     *    https://sailsjs.com/plugins/databases                                 *
     *                                                                          *
     * 2. Install it as a dependency of your Sails app.                         *
     *    (For example:  npm install sails-mysql --save)                        *
     *                                                                          *
     * 3. Then pass it in, along with a connection URL.                         *
     *    (See https://sailsjs.com/config/datastores for help.)                 *
     *                                                                          *
     ***************************************************************************/
    adapter: 'sails-mongo',
    url: 'mongodb://huertos-api:huertos@18.188.86.138:27017/huertos'
    //url: 'mongodb://api:api@localhost:27017/test',
    // "mongodb+srv://huertosAPI:VxXiPjH3Qrgxxms@cluster0-shard-00-02-dx2ao.gcp.mongodb.net:27017/huertos",
    //"mongodb://test
    //   //"mongodb+srv://huertosAPI:VxXiPjH3Qrgxxms@cluster0-shard-00-02-dx2ao.gcp.mongodb.net/test?retryWrites=true&w=majority",
    //   //"mongodb+srv://ghapi:zRINaNIvW8tqELtY@cluster0-s7lnh.mongodb.net:27017/test?retryWrites=true&w=majority",
    //   "mongodb://ghapi:zRINaNIvW8tqELtY@cluster0-shard-00-00-s7lnh.mongodb.net:27017,cluster0-shard-00-01-s7lnh.mongodb.net:27017,cluster0-shard-00-02-s7lnh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
    //    ssl: true,
  }
};
