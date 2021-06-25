const { User } = require('../models');
const ApiError = require('../ErrorHandler/APIerror');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.signUp = async (req, res, next) => {
  const { firstName, lastName, Role, email, password } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({
        firstName,
        lastName,
        Role,
        email,
        hashedPassword,
      });
      if (newUser) {
        req.session.user = newUser;
        return res.status(201).json({
          user: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            id: newUser.id,
          },
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return next(ApiError.InternalServerError('Failed to Signup'));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors
        .array()
        .map(error => ({ [error.param]: error.msg }));
      return next(new ApiError(422, firstError));
    } else {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        const match = await bcrypt.compare(password, user.hashedPassword);

        if (match) {
          req.session.user = user;
          return res.status(200).json({
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              id: user.id,
            },
          });
        } else {
          next(ApiError.badRequest('Invalid credentials'));
        }
      } else {
        next(ApiError.badRequest('Invalid credentials'));
      }
    }
  } catch (error) {
    console.log(error);
    return next(ApiError.InternalServerError('Failed to login'));
  }
};

module.exports.logout_delete = (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      next(ApiError.Unauthorized('Failed to log out'));
      return;
    } else {
      res.sendStatus(204);
    }
  });
};

module.exports.checkSession = async (req, res, next) => {
  try {
    if (req.session.user) {
      return res.status(200).json({
        auth: true,
        user: req.session.user,
      });
    }
    return res.status(200).json({
      auth: false,
      error: 'User not signned',
    });
  } catch (e) {
    return next(ApiError.InternalServerError('Server down'));
  }
};
