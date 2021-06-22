const { check } = require('express-validator');

exports.validSign = [
  check('firstName', 'First Name is required')
    .isAlpha()
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage('First Name must be between 2 to 32 characters'),
  check('lastName', 'Last Name is required')
    .isAlpha()
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage('Last Name must be between 2 to 32 characters'),
  check('password', 'Password is required')
    .isLength({
      min: 5,
    })
    .withMessage('Password to weak'),
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address'),
];

exports.validLogin = [
  check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  check('password', 'Password is required')
    .isLength({
      min: 5,
    })
    .withMessage('Password to weak'),
];
