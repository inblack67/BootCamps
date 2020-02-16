const mongoose = require('mongoose');

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  });

  console.log(`Mongo is here : ${connect.connection.host}`.cyan.bold.underline);
}

module.exports = connectDB;