const { Event, User } = require('../models');
const ApiError = require('../Errorhandler/APIerror');
const { validationResult } = require('express-validator');

User.hasMany(Event, {foreignKey: 'TeacherId'});
Event.belongsTo(User, {foreignKey: 'TeacherId',as: "Teacher"});

module.exports.Events = async (req, res, next) => {
  try {
    let data = await Event.findAll({
      include:[
       { model: User,
        as: "Teacher"
      }

      ] 
    });

    res.json(data).status(200);
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};

module.exports.createEvent = async (req, res, next) => {
  const { TeacherId, Batch, Note, from, to } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('still errors in req validator');
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      console.log('else part');
      const newEvent = await Event.create({
        TeacherId,
        Batch,
        Note,
        from,
        to,
      });

      if (true) {
        return res.status(201).json(newEvent);
      }
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};
