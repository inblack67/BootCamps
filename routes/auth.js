const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

const { getMe, forgotPassword, resetPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);



module.exports = router;