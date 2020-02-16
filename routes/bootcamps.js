const express = require('express');
const {getBootcamps, getBootcamp,createBootcamp, updateBootcamp,deleteBootcamp } = require('../controllers/bootcamps');

const router = express.Router();


router.route('/')
.get(getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);



// cmd + d = highlight all the follwing, but one by one.


module.exports = router;