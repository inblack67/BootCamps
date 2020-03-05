const express = require('express');
const {

  getBootcamps, 
  getBootcamp,
  createBootcamp, 
  updateBootcamp,
  deleteBootcamp ,
  getBootcampsWithinRadius

} = require('../controllers/bootcamps');

const router = express.Router();

const courseRouter = require('./courses');

// re-route to course router
router.use('/:bootcampId/courses', courseRouter);


router.route('/radius/:zipcode/:distance')
.get(getBootcampsWithinRadius);


router.route('/')
.get(getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);


// cmd + d = highlight all the follwing, but one by one.


module.exports = router;