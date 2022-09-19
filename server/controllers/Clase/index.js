const   express = require('express'),
        router = express.Router({ mergeParams: true }),
        asyncHandler = require('express-async-handler'),
        claseCtr = require('./claseCtr');
        
router.get('/class', (req, res) => res.status(200).json({ msg: 'Hello from clase index' }));

module.exports = router;