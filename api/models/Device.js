/**
 * Device.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // The kind of devices will be defined by GH. By now: ['ioTest','ecSensor','waterMedulla']
    kind: {
      type: 'string',
      description: 'GH identifier name for a certain kind of device'},

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

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
           
    admin: {collection: 'user', via: 'managing'},
    farm: {model: 'farm'},
    environment: {collection: 'environment', via: 'devices'},
    batch: {collection: 'batch', via: 'devices'},
  },
};
