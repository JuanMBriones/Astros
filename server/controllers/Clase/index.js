const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/class', (req, res) => res.status(200).json({msg:
    'Hello from clase index'}));

module.exports = router;
