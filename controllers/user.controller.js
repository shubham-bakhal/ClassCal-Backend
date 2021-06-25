const { User, Event } = require('../models');
const ApiError = require('../ErrorHandler/APIerror');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

module.exports.AvailableTeachers = async (req, res, next) => {
  const { day, from, to } = req.body;
  console.log(day, from, to);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('still errors in req validator');
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const teachers = await User.findAll({
    
        attributes: ['id', 'firstName', 'lastName'],
        include: [
          {
            model: Event,
            attributes: ['id'],
          },
        ],
        where: {
          Role: 'Teacher',
          [Op.or]: [
            {
              '$Events.day$': {
                [Op.or]: [{ [Op.ne]: day }, { [Op.is]: null }],
              },
            },
            {
              '$Events.from$': {
                [Op.or]: [{ [Op.notBetween]: [from, to] }, { [Op.is]: null }],
              },
              '$Events.to$': {
                [Op.or]: [{ [Op.notBetween]: [from, to] }, { [Op.is]: null }],
              },
            },
          ],
        },
      });

      res.json(teachers).status(200);
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};

module.exports.searchTeacherForEvent = async (req, res, next) => {
  const { searchStr } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('still errors in req validator');
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const teachers = await User.findOne({
     
        attributes: ['id', 'firstName', 'lastName'],
        include: [
          {
            model: Event,
          },
        ],
        where: {
          Role: 'Teacher',
          [Op.or]: [{ firstName: searchStr }, { lastName: searchStr }],
        },
      });

      res.json(teachers).status(200);
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};
