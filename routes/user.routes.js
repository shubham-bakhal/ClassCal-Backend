const router = require('express').Router();

// import controllers
const {
  AvailableTeachers,
  searchTeacherForEvent,
} = require('../controllers/user.controller');

// actual routes
router.post('/availableTeachers', AvailableTeachers);
router.post('/searchTeacherForEvent', searchTeacherForEvent);

module.exports = router;
