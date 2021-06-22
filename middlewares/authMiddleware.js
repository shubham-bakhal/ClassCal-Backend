const OTP = require('../models/otpModel');

const RequireLogin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      res.status(401).send('Unauthenticated');
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send('Unauthenticated');
  }
};

module.exports = { RequireLogin };
