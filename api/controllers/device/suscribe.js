module.exports = {


  friendlyName: 'Suscribe',


  description: 'Suscribe device.',


  inputs: {
    deviceId: {
      description: 'id of a device that user is managing',
      type: 'string',
      required: true
    },
    deviceStatus: {
      description: 'a json object containing a status report',
      type: 'json',
    }
  },


  exits: {
    success: {description: 'Device successfully suscribed!'},
    badId: {description: 'Device ID not found'},
    badStatusReport: {description: 'Bad device status object. '+
    'The received status report object does not match with '+
    'expected for the device'}
  },

  fn: async function (inputs) {
    //var devToSuscribe = 
    return;

  }

};
