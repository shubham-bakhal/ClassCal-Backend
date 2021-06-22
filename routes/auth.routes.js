const router = require('express').Router();

// Request validator
const {
    validSign,
    validLogin,
  } = require('../reqValidator/validAuth'); 


// import controllers
const { signUp, login,logout_delete } = require('../controllers/auth.controller');

// actual routes
router.post('/signup', validSign, signUp);
router.post('/login', validLogin, login);
router.delete('/logout', logout_delete);

module.exports = router;
