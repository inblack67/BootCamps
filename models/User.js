const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({

  name:{
    type: String,
    required: [true, 'Enter a name']
  },

  email: {
    type: String,
    required: [true, 'Enter an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },

  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },

  password: {
    type: String,
    required: [true, 'Enter a password'],
    minlength: 8,
    select: false // get all user data but except the password
  },

  resetPasswordToken: String,

  resetPasswordExpire: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  }

});


// encrypt passwd
UserSchema.pre('save', async function(next) {

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// sign JWT and return (method, not a static so will be called on actual user)
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

// match password
UserSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password); 
  // passwd for the particular user which calls this fn
}

module.exports = mongoose.model('User', UserSchema);