/**
 * Device.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const kinds = require('./deviceKinds.json');
const kindTags = _.pluck(kinds, 'tag');

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // The kind of devices will be defined by GH. By now: ['ioTest','ecSensor','waterMedulla']
    kind: {
      type: 'string',
      description: 'GH identifier name for a certain kind of device',
      isIn: kindTags
    },

    alias: {
      type: 'string',
      description: 'Frendly name by the user'
    },

    status: {
      type: 'json',
      description: 'a json object with status of all the device parameters'
    },

    settings: {
      type: 'json',
      description: 'a json object with device settings'
    },

    port: {
      type: 'string',
      description: 'a string with a port path'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    history: {
      collection: 'history', via: 'device'
   },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    admin: { collection: 'user', via: 'managing' },
    farm: { model: 'farm' },
    environment: { collection: 'environment', via: 'devices' },
    batch: { collection: 'batch', via: 'devices' }
  },

  // lifecycle functions:
  /*
  afterCreate: async function (createdRec, proceed) {
    const record = {
      status: [{
        timestamp
      }]
    };
    createdRec['history'] = await History.create(record);
    return proceed();
  },
  */
  
  beforeUpdate: async function (valuesToSet, proceed) {
    const device = await Device.findOne( {id: valuesToSet.id} );
    console.log(device);
    var record = {
      device: valuesToSet.id,
      status: {}
    }
    /*
    if (valuesToSet.hasOwnProperty('settings')){
      const props = Object.keys(valuesToSet.settings);
      props.map( p => {
        if (valuesToSet.settings[p] != device.settings[p]){
          record.settings[p] = device.settings[p];
        }
      });
      record.settings['timestamp'] = valuesToSet.updatedAt;
    }
    */
    if (valuesToSet.hasOwnProperty('status')){
      const props = Object.keys(valuesToSet.status);
      console.log(props);
      props.map( p => {
        if (valuesToSet.status[p] != device.status[p]){
          record.status[p] = device.status[p];
        }
      });
      if (record.status) {
        await History.create( record );
      }
    }
    
    return proceed();
  }
};
