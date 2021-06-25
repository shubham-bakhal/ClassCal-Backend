const { check } = require('express-validator');

exports.validCreteEvent = [
  check('Teacher', 'Teacher is required'),
  check('Batch', 'Batch is required').isIn([
    'Comp 1',
    'Comp 2',
    'Comp 3',
    'Mech 1',
    'Mech 2',
    'Mech 3',
  ]),
  check('day', 'Day is required'),
  check('from', 'From time is required'),
  check('to', 'End time is required'),
  check('Note', 'Max lenght of note is 255')
    .optional()
    .isLength({
      max: 255,
    })
    .withMessage('Max lenght of note is 255'),
];
