const router = require('express').Router();

// Request validator
const { validSign, validLogin } = require('../reqValidator/validAuth');

// import controllers
const {
  signUp,
  login,
  logout_delete,
  checkSession,
} = require('../controllers/auth.controller');

// actual routes
router.post('/signup', validSign, signUp);
router.post('/login', validLogin, login);
router.delete('/logout', logout_delete);
router.get('/checksession', checkSession);

module.exports = router;
