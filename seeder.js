const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// env
dotenv.config( { path: './config/config.env' } );

// models
const Bootcamp = require('./models/Bootcamp');

// db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

// read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

// delete into db
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

if(process.argv[2] === '-i')
{
  importData();
}
else if(process.argv[2] === '-d')
{
  deleteData();
}