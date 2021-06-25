const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({ path: './config/config.env' });

// Custom imports
require('dotenv').config({ path: './config/config.env' });
const session = require('./middlewares/session');
const { Event, User } = require('./models');
const ApiError = require('./ErrorHandler/APIerror');
const apiErrorHandler = require('./middlewares/api_error_handling');

// APP
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://class-calender.netlify.app',
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })
);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  next();
});
app.use(session);

// PORT for app
PORT = process.env.PORT || 5000;
const db = require('./models');

db.sequelize.sync().then(res => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});

// Relation
User.hasMany(Event, { foreignKey: 'TeacherId' });
Event.belongsTo(User, { foreignKey: 'TeacherId', as: 'Teacher' });

//Load all routes

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const eventsRoutes = require('./routes/events.routes');

//  Routes

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);

app.use('/', (req, res, next) => {
  res.status(200).send('Well connected 😀');
});

// if not in our domain routes
app.use((req, res, next) => {
  next(ApiError.NotFound('No route to this site'));
});
app.use(apiErrorHandler);
