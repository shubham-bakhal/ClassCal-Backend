const { Event, User } = require('../models');
const ApiError = require('../Errorhandler/APIError');
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");

module.exports.Events = async (req, res, next) => {
  try {
    let data = await Event.findAll({
      include: [{ model: User, as: 'Teacher' }],
    });

    res.json(data).status(200);
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};

module.exports.todaysEvents = async (req, res, next) => {
  try {
 
    let Events = await Event.findAll({
      where: {day: {
        [Op.lt]: new Date(),
        [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
      }},
      include: [{ model: User, as: 'Teacher' }],
    });

    // const Events = Event.findAll({
    //   where: sequelize.where(sequelize.fn('date', sequelize.col('day')), '=', '2021-06-24')
    // })

    res.json(Events).status(200);
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};

module.exports.createEvent = async (req, res, next) => {
  const { TeacherId, Batch, Note, day, from, to } = req.body;

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
        day,
        from,
        to,
      });

      if (newEvent) {
        return res.status(201).json(newEvent);
      }
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};

module.exports.updateEvent = async (req, res, next) => {
  const { id, TeacherId, Batch, day, Note, from, to } = req.body;

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
      const isUpdated = await Event.update(
        { TeacherId, Batch, Note, day, from, to },
        {
          where: {
            id,
          },
          returning: true,
          plain: true,
        }
      );

      if (isUpdated) {
        const updatedEvent = await Event.findOne({
          where: {
            id,
          },
        });
        return res.status(201).json(updatedEvent);
      }
      return next(ApiError.badRequest('Event not found'));
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};

module.exports.deleteEvent = async (req, res, next) => {
  const { id } = req.body;
  console.log('ID ', id);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('still errors in req validator');
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      await Event.destroy({
        where: {
          id,
        },
      });
      res.status(204).send('deleted');
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.badRequest('Validation error'));
  }
};
