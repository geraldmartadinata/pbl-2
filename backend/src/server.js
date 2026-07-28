const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

const startServer = async () => {
  try {
    // check db connection
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL database');

    const port = env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${port}`);
    });

    // handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
