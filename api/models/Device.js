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
      isIn: kindTags,
    },

    alias: {
      type: 'string',
      description: 'Frendly name by the user'
    },

    status: {
      type: 'json',
      description: 'a json object with status of all the device parameters'
    },

    history: {
      type: 'json',
      description: 'a json array containing a history of status object'
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


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    admin: {collection: 'user', via: 'managing'},
    farm: {model: 'farm'},
    environment: {collection: 'environment', via: 'devices'},
    batch: {collection: 'batch', via: 'devices'},
  },
};
