const express = require('express');
const router = express.router({mergeParams: true});
const asyncHandler = require('express-async-handler');
const profesorCtr = require('./profesorCtr');

router.get('/prof', (req, res) => res.status(200).json({msg:
    'Hello from prof index'}));

router.get('/profesores', asyncHandler(profesorCtr.getAll()));

router.post('/newprof', asyncHandler(profesorCtr.createP()));

module.exports = router;
