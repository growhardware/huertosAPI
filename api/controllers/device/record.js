const Device = require("../../models/Device");

module.exports = {


  friendlyName: 'Record',


  description: 'Record device.',


  inputs: {
    id: {type: 'number', description: 'A number with the device id.'},
    statusReport: {type: 'json', description: 'A stingified json with the device status.'}
  },


  exits: {
    badId: {responseType: 'notFound', description: 'Unable to find device id.'},
    success: {description:'Device status report was stored!'}
  },


  fn: async function (inputs) {
    console.log('Report: '+inputs);
    //let status = JSON.parse(inputs.statusReport);
    var dev = await Device.findOne({id: inputs.id});
    if(!dev){throw 'notFound';}
    console.log('tenemos el device!');
    // All done.
    return;

  }


};
