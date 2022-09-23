const express = require('express');
const router = express.Router({mergeParams: true});
const asyncHandler = require('express-async-handler');
const profesorCtr = require('./profesorCtr');

router.get('/prof', (req, res) => res.status(200).json({msg:
    'Hello from profesor index'}));

router.get('/profesores', asyncHandler(profesorCtr.getAll()));

router.get('/profMaterias', asyncHandler(profesorCtr.getProfMaterias()));

router.post('/newprof', asyncHandler(profesorCtr.createP()));

module.exports = router;
