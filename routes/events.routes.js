const router = require('express').Router();

// Req validator
const { validCreteEvent } = require('../reqValidator/validEvent');
const { RequireLogin,RequireAdmin } = require('../middlewares/authMiddleware');
// import controllers
const {
  createEvent,
  Events,
  updateEvent,
  deleteEvent,
  todaysEvents,
} = require('../controllers/events.Controller');

// actual routes
router.post(
  '/create',
  RequireLogin,
  RequireAdmin,
  validCreteEvent,
  createEvent
);
router.get('/Events', Events);
router.delete('/delete', RequireLogin, RequireAdmin, deleteEvent);
router.patch(
  '/update',
  RequireLogin,
  RequireAdmin,
  validCreteEvent,
  updateEvent
);
router.get('/todaysEvents', todaysEvents);

module.exports = router;
