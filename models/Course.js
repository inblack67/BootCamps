const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({

  title: {
    type: String,
    trim: true,
    // required: [true, 'Add a course title']
  },

  desciption: {
    type: String,
    // required: [true, 'Add a description']
  },

  weeks: {
    type: String,
    // required: [true, 'Add number of weeks']
  },

  tuition: {
    type: Number,
    // required: [true, 'Add a tuition cost']
  },

  minimumSkill: {
    type: String,
    // required: [true, 'Add minimum level of skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },

  scholarShipAvailable: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    // required: true
  }

});


module.exports = mongoose.model('Course', CourseSchema);