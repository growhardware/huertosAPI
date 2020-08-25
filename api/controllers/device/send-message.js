module.exports = {


  friendlyName: 'Send message',


  description: 'Send a message (e: a command) to a device',


  inputs: {

    devId: {type: 'string', required: true},
    message: {type: 'string', required: true},

  },


  exits: {
    success: {description: 'The message was published'},

  },


  fn: async function (inputs, exits, env) {
    /*
    user = env.req.session.userId;
    */
    // All done.
    return;

  }


};
