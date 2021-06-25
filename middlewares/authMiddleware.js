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
const RequireAdmin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      res.status(401).send('Unauthenticated');
    } else {
      if (req.session.user.dataValues.Role !== 'Admin') {
        res.status(401).send('Need to be admin');
      } else {
        next();
      }
    }
  } catch (error) {
    res.status(401).send('Unauthenticated');
  }
};

module.exports = { RequireLogin, RequireAdmin };
