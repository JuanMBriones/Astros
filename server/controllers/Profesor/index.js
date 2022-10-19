/* eslint-disable new-cap */
const express = require('express');
const router = express.Router({mergeParams: true});
const asyncHandler = require('express-async-handler');
const profesorCtr = require('./profesorCtr');

router.get('/prof', (req, res) => res.status(200).json({msg:
    'Hello from profesor index'}));

router.get('/profesores', asyncHandler(profesorCtr.getAll()));

router.get('/profe', asyncHandler(profesorCtr.getDataProfe()));

router.get('/profMaterias', asyncHandler(profesorCtr.getProfMaterias()));

router.put('/assignProf', asyncHandler(profesorCtr.assignProf()));

router.put('/unassignProf', asyncHandler(profesorCtr.unassignProf()));

router.get('/horarioProf', asyncHandler(profesorCtr.horarioProf()));

router.get('/warnings', asyncHandler(profesorCtr.warnings()));

module.exports = router;
