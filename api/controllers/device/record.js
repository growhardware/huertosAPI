module.exports = {


  friendlyName: 'Record',


  description: 'Record device.',


  inputs: {
    deviceId: {
      description: 'id number of a user`s device',
      type: 'number',
      required: true
    },
    deviceStatus: {
      description: 'a json object containing a status report',
      type: 'json',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    console.log('TODO: IMPLEMENT');
    console.log(inputs);
    // All done.
    return;

  }


};
