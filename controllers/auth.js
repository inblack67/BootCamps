const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// desc Register a user
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req,res, next) => {

  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  sendTokenCookie(user, 200, res);

});


// desc Login User
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req,res, next) => {

  const { email, password } = req.body;

  if(!email || !password)
  {
    return next(new ErrorResponse('Provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');   
  // since passwd is excluded in the User model

  if(!user)
  {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if(!isMatch)
  {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // token
  sendTokenCookie(user, 200, res);

});

// desc get loggedin User
// @route GET /api/v1/auth/me
// @access private
exports.getMe = asyncHandler(async (req,res, next) => {

  const user = await User.findById(req.user); // auth user middleware

  if(!user)
  {
    return next(new ErrorResponse('Not Authorized', 401));
  }

  res.status(200).json({ success: true, data: user })

});


// cookies
const sendTokenCookie = (user, statusCode, res) => {

  const token = user.getSignedJwtToken();

  const options = {

    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,   // only accessible throught client side script
  }

  if(process.env.NODE_ENV === 'production')
  {
    options.secure = true;    // secure flag on our cookie
  }

  res.status(statusCode).cookie('token', token, options).json({ success: true, token })

}