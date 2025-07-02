/**
 * Device.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const kinds = require("./deviceKinds.json");
const kindTags = _.pluck(kinds, "tag");

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // The kind of devices will be defined by GH. By now: ['ioTest','ecSensor','waterMedulla']
    kind: {
      type: "string",
      description: "GH identifier name for a certain kind of device",
      isIn: kindTags,
    },

    alias: {
      type: "string",
      description: "Frendly name by the user",
    },

    status: {
      type: "json",
      description: "a json object with status of all the device parameters",
    },

    plan: {
      type: "json",
      description: "a json object with device plan",
    },

    port: {
      type: "string",
      description: "a string with a port path",
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    history: {
      collection: "history",
      via: "device",
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    admin: { collection: "user", via: "managing" },
    farm: { model: "farm" },
    environment: { collection: "environment", via: "devices" },
    batch: { collection: "batch", via: "devices" },
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
  // afterCreate: function (newDevice, next) {
  //   // Emit an event via sockets to all connected clients
  //   sails.sockets.broadcast("newData", newDevice);
  //   return next();
  // },
  // afterUpdate: function (updatedDevice, next) {
  //   //   // Emit an event via sockets to all connected clients
  //   // sails.sockets.broadcast("device", "updatedDevice", updatedDevice);
  //   sails.sockets.broadcast("device", updatedDevice);
  //   return next();
  // },
  beforeUpdate: async function (valuesToSet, proceed) {
    console.log('valuesToSet', valuesToSet);

    const device = await Device.findOne({ id: valuesToSet.id });
    console.log("the device ");
    console.log(device);
    var record = {
      device: valuesToSet.id,
      status: {},
    };
    /*
    if (valuesToSet.hasOwnProperty('plan')){
      const props = Object.keys(valuesToSet.plan);
      props.map( p => {
        if (valuesToSet.plan[p] != device.plan[p]){
          record.plan[p] = device.plan[p];
        }
      });
      record.plan['timestamp'] = valuesToSet.updatedAt;
    }
    */
    if (valuesToSet.hasOwnProperty("status")) {
      const props = Object.keys(valuesToSet.status);
      console.log(props);
      props.map((p) => {
        if (valuesToSet.status[p] != device.status[p]) {
          record.status[p] = device.status[p];
        }
      });
      if (record.status) {
        await History.create(record);
      }
    }

    return proceed();
  },
  afterCreate: async function (newDevice, proceed, next) {
    pubSailsSocket(newDevice, next);
    await publishToHiveMQ(newDevice, 'create');
    return proceed();
  },

  afterUpdate: async function (updatedDevice, proceed, next) {
    pubSailsSocket(updatedDevice, next);
    await publishToHiveMQ(updatedDevice, 'update');
    return proceed();
  }
};

function pubSailsSocket(device, next){
  sails.socket.broadcast('device', device);
  return next();
}

async function publishToHiveMQ(device, action) {
  if (!sails.mqttClient?.connected) return;

  const topic = `gh-mqtt/${device.id}/updates`; // Topic personalizado
  // const message = JSON.stringify({
  //   action,
  //   device,
  //   timestamp: new Date()
  // });

  const message = JSON.stringify(device['plan']);

  sails.mqttClient.publish(topic, message, { qos: 1 }, (err) => {
    if (err) sails.log.error('Error MQTT:', err);
    else sails.log.debug(`Publicado en ${topic}`);
  });
}

// async function publishToHiveMQ(device, action) {
//   if (!sails.mqttClient?.connected) return;

//   const topic = `gh-mqtt/${device.id}/updates`; // Topic personalizado
//   // const message = JSON.stringify({
//   //   action,
//   //   device,
//   //   timestamp: new Date()
//   // });

//   const plan = {
//     "plan": JSON.stringify(device['plan'])
//   }
  
//   const message = JSON.stringify(plan);
//   // const message = device['plan'];

//   sails.mqttClient.publish(topic, message, { qos: 1 }, (err) => {
//     if (err) sails.log.error('Error MQTT:', err);
//     else sails.log.debug(`Publicado en ${topic}`);
//   });
// }