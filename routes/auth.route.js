const router = require('express').Router();


// import controllers
const {
  signUp,
  login
} = require('../controllers/auth.controller');



// actual routes
router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;
