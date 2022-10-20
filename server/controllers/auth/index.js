/* eslint-disable new-cap */
const express = require('express');
const router = express.Router({mergeParams: true});
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);


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

router.post('/login', async (req, res) => {
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

module.exports = router;
