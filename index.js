const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Custom imports
require('dotenv').config({ path: './config/config.env' });

// APP
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// PORT for app
PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${port}`));

//Load all routes

//  Routes

app.use('/', (req, res, next) => {
  res.status(200).send('Well connected 😀');
});

// if not in our domain routes
app.use((req, res, next) => {
  next(ApiError.NotFound('No route to this site'));
});
