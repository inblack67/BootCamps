const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const mapquest = require('mapquest');
const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');


// load routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// load env vars
dotenv.config({path: './config/config.env'});

connectDB();

const app = express();

// body parser
app.use(express.json());

// dev logger
if(process.env.NODE_ENV === 'development')
{
  app.use(morgan('dev'));
}

// use routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// error middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log
  (`Server running in ${process.env.NODE_ENV} mode and on port ${PORT}`.yellow.bold);
});

//  handling rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});