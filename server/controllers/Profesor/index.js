const   express = require('express'),
        router = express.Router({ mergeParams: true }),
        asyncHandler = require('express-async-handler'),
        profesorCtr = require('./profesorCtr');
        
router.get('/prof', (req, res) => res.status(200).json({ msg: 'Hello from prof index' }));

router.get('/profesores', asyncHandler(profesorCtr.getAll()));

router.post('/newprof', asyncHandler(profesorCtr.createP()));

module.exports = router;