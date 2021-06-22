const { User } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.signUp = async (req, res, next) => {
  const { firstName, lastName, Role, email, password } = req.body;

  if (password.length < 5) {
    res.send('To weak password').status(204);
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      firstName,
      lastName,
      Role,
      email,
      hashedPassword,
    });
    if(newUser){
      req.session.user = newUser;
      return res.status(201).json({
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          _id: newUser._id,
        },
      });
    }
    
  } catch (error) {
    if (error.original.errno == 1062) {
      res.send('User already exists').status(204);
    }
    res.send(error.message).status(204);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if(user){
      const match = await bcrypt.compare(password, user.hashedPassword);

      if (match) {
        req.session.user = user;
        return res.status(200).json({ user: user.id });
      } else {
        res.send('Invalid creadintial').status(204);
      }
    }else{
      res.send("User not found").status(204);
    }

    
  } catch (error) {
    console.log(error);
    res.send(error.message).status(204);
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