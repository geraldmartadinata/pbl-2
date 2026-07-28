const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// security headers
app.use(helmet());

// enable cors
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HIMTI Registration API is running.',
  });
});

// api routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFound);

// global error handler
app.use(errorHandler);

module.exports = app;
