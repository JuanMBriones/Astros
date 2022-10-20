require('dotenv').config();

const express = require('express');
const app = express();
const dbConfig = require('./dbConfig');
const {OAuth2Client} = require('google-auth-library');
const sendAsJSON = require('./middleware/sendAsJson');
const eHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(require('cors')());

// initialize db
dbConfig();

app.get('/', (req, res) => {
  res.json({
    msg: 'Hello from Astros index route!',
  });
});

app.use('/api', require('./controllers/Profesor'));

app.use('/api', require('./controllers/Clase'));

// error handling middleware
app.use(eHandler());
app.use(sendAsJSON());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

/**
 * upsert
 * @param {*} array
 * @param {*} item
 */
function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

const users = [];

app.post('/api/login', async (req, res) => {
  const {token} = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const {name, email, picture} = ticket.getPayload();
  upsert(users, {name, email, picture});
  res.json({
    name,
    email,
    picture}).status(201);
});
