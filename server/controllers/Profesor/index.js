/* eslint-disable new-cap */
const express = require('express');
const router = express.Router({mergeParams: true});
const asyncHandler = require('express-async-handler');
const profesorCtr = require('./profesorCtr');

router.get('/prof', (req, res) => res.status(200).json({msg: 'Hello from profesor index'}));

router.get('/profesores', asyncHandler(profesorCtr.getAll()));

router.get('/profe', profesorCtr.getDataProfe());

router.post('/profe', asyncHandler(profesorCtr.postProfesor()));

router.post('/giveAdmin', asyncHandler(profesorCtr.givePower()));

router.post('/quitAdmin', asyncHandler(profesorCtr.nerfProfessor()));

router.post('/isAdmin', asyncHandler(profesorCtr.isAdmin()));

router.get('/profMaterias', asyncHandler(profesorCtr.getProfMaterias()));

router.get('/assignProf', asyncHandler(profesorCtr.assignProf()));

router.put('/assignConfirm', asyncHandler(profesorCtr.assignConfirm()));

router.put('/unassignProf', asyncHandler(profesorCtr.unassignProf()));

router.get('/horarioProf', asyncHandler(profesorCtr.horarioProf()));

router.get('/warnings', asyncHandler(profesorCtr.warnings()));

router.put('/changeStatus', asyncHandler(profesorCtr.changeStatus()));

router.delete('/reset', asyncHandler(profesorCtr.deleteAll()));

module.exports = router;
