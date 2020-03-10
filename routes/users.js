const express = require('express');
const router = express.Router({ mergeParams: true });

const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const User = require('../models/User');

// middlewares
const advancedQueries = require('../middleware/advancedQueries');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

// routes
router.route('/').get(advancedQueries(User), getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);


module.exports = router;