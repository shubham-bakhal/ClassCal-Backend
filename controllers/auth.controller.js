const { User } = require('../models');
const ApiError = require('../Errorhandler/APIError');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// module.exports.sendOTP = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const otpObj = await OTP.findOne({
//       where: {
//         email,
//       },
//     });
//     var otpToSend = '';

//     if (otpObj) {
//       await otpObj.update({
//         otp: Math.floor(100000 + Math.random() * 900000),
//       });
//       otpToSend = otpObj.otp;
//     } else {
//       const newOTPobj = await OTP.create({
//         email,
//         otp: Math.floor(100000 + Math.random() * 900000),
//       });
//       console.log(newOTPobj);
//       otpToSend = newOTPobj.otp;
//     }
//     const oAuth2Client = new google.auth.OAuth2(
//       process.env.CLIENT_ID,
//       process.env.CLEINT_SECRET,
//       process.env.REDIRECT_URI
//     );
//     oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
//     const accessToken = await oAuth2Client.getAccessToken();

//     const transport = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: process.env.EMAIL_FROM,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLEINT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     });

//     const mailOptions = {
//       from: `Class calender 🧁 <${process.env.EMAIL_FROM}>`,
//       to: `${email}`,
//       subject: 'Get your email verified',
//       text: `Your OTP is: ${otpToSend}`,
//       html: `<h1>Your OTP is: ${otpToSend}</h1>`,
//     };

//     transport.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//         return res.status(400).json(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.status(200).send('Email sent: ' + info.response);
//       }
//     });

//     res.status(201).send(otpToSend);
//     // res.status(201).json("Email sent!!");
//   } catch (err) {
//     console.log(err);
//     res.send('err').status(204);
//   }
// };

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
          res.send('Invalid creadintial').status(204);
        }
      } else {
        res.send('User not found').status(204);
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
