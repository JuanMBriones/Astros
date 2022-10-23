/* eslint-disable new-cap */
const express = require('express');
const router = express.Router({mergeParams: true});
const asyncHandler = require('express-async-handler');
const claseCtr = require('./claseCtr');

router.get('/class', (req, res) => res.status(200).json({msg: 'Hello from clase index'}));

router.get('/clases', asyncHandler(claseCtr.getClases()));

router.get('/profesores', asyncHandler(claseCtr.getProfesores()));

module.exports = router;
