/* eslint-disable max-len */
const mongoose = require('mongoose');

/**
 * @description Connect to MongoDB Atlas
 */
function setup() {
  let uri = 'MONGODB_URI';

  if (process.env.NODE_ENV === 'test') uri += '_TEST';
  else if (process.env.NODE_ENV === 'dev') uri += '_DEV';
  else if (process.env.NODE_ENV === 'prod') uri += '_PROD';

  mongoose.connect(process.env[uri])
    .then((result) => console.log('Connection successful'))
    .catch((err) => console.log('Error in connection to db :', err));

  mongoose.connection.on('error', (error) => {
    console.log(`Connection to database failed: ${error}`);
  });

  mongoose.connection.on('connected', () => console.log(`Connected to database`));
  mongoose.connection.on('disconnected', () => console.log(`Disconnected from database`));
}

module.exports = setup;
