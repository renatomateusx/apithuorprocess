var express = require('express');
var reviews = require('../schemas/reviews');


var router = express.Router();
/* GET home page. */
router.post('/GetReviews', reviews.GetAllReviews);
router.post('/SaveReview', reviews.SaveReview);
router.post('/GetReviewByID', reviews.GetReviewByID);
router.post('/DeleteReviewByID', reviews.DeleteReviewByID);


module.exports = router;
