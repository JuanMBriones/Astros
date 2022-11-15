/* eslint-disable new-cap */
const express = require('express');
const router = express.Router({mergeParams: true});
const asyncHandler = require('express-async-handler');
const claseCtr = require('./claseCtr');

router.get('/class', (req, res) => res.status(200).json({msg: 'Hello from clase index'}));

router.get('/clases', asyncHandler(claseCtr.getClases()));

router.get('/clase', asyncHandler(claseCtr.getClase()));

router.get('/profesores', asyncHandler(claseCtr.getProfesores()));

router.post('/add', asyncHandler(claseCtr.addClass()));

router.post('/remove', asyncHandler(claseCtr.removeClass()));

router.post('/quejale', asyncHandler(claseCtr.parseSchedule()));

module.exports = router;
