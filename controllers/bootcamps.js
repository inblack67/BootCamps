const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder'); 


// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(
  async (req,res,next) => {

    const reqQuery = {...req.query};

    const removeFields = ['select', 'sort', 'page', 'limit'];    // our custom filter

    removeFields.forEach(field => delete reqQuery[field]);

    // req.query is an object so stringify needed
    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = Bootcamp.find(JSON.parse(queryString));

    // select fields - mongoose requires space in between
    if(req.query.select)
    {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // sort
    if(req.query.sort)
    {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }

    else
    {
      query = query.sort('-createdAt');
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1)*limit;
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();

    query.skip(startIndex).limit(limit);

    const bootcamps = await query;

    const pagination = {};

    if(endIndex < total)
    {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    if(startIndex > 0)
    {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps
    });
}
);

// @desc get one bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(
  async (req,res,next) => {

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
}
);

// @desc create new bootcamp
// @route POST /api/v1/bootcamps
// @access private (have to be logged in)
exports.createBootcamp = asyncHandler(
  async (req,res,next) => {


    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp
    });
}
);

// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(
  async (req,res,next) => {


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
  }
);

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(
  async (req,res,next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp)
    {
      return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }
  
    res.status(200).json({
      success: true,
      data: {msg: "deleted"}
    });
}

);

// @desc get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private

exports.getBootcampsWithinRadius = asyncHandler(

  async (req,res,next) => {
    const { zipcode, distance } = req.params;

    // get latitude/longitude
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const long = loc[0].longitude;

    // cal radius 
    // div distance by radius (3963 miles) of earth
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [ [ long, lat ], radius ] } }
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
  }
);