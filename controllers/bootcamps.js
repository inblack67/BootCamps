const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');


// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req,res,next) => {

  try {
    const bootcamp = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: bootcamp.length,
      data: bootcamp
    }); 
  } catch (error) {
    next(error);
  }
}

// @desc get one bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req,res,next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp)
    {
      // id is formatted but does not exists in the db
      return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });

  } catch (error) {
    // not formatted object id
    next(error);
  }
}

// @desc create new bootcamp
// @route POST /api/v1/bootcamps
// @access private (have to be logged in)
exports.createBootcamp = async (req,res,next) => {

  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    next(error);
  }
  next();
}

// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req,res,next) => {

try {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if(!bootcamp)
  {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
} catch (error) {
  next(error);
}

  next();
}

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req,res,next) => {

  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp)
    {
      return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }
  
    res.status(200).json({
      success: true,
      data: {msg: "deleted"}
    });

  } catch (error) {
    next(error);
  }

  next();
}