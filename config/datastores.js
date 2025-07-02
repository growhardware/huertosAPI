require('dotenv').config();
// const defaultUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/growhardware';

module.exports.datastores = {
  default: {
    adapter: 'sails-mongo',
    url: process.env.MONGO_URL,
  }
};

