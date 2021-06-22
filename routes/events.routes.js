const router = require('express').Router();

// Req validator
const { validCreteEvent } = require('../reqValidator/validEvent');

// import controllers
const { createEvent , Events} = require('../controllers/events.Controller');

// actual routes
router.post('/create', createEvent);
router.get('/Events', Events);

module.exports = router;
