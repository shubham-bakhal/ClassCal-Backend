const router = require('express').Router();

// Req validator
const { validCreteEvent } = require('../reqValidator/validEvent');

// import controllers
const { createEvent , Events, updateEvent, deleteEvent, todaysEvents} = require('../controllers/events.Controller');

// actual routes
router.post('/create', createEvent);
router.get('/Events', Events);
router.delete('/delete', deleteEvent);
router.patch('/update', updateEvent);
router.get('/todaysEvents', todaysEvents);

module.exports = router;
