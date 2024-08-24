const express = require("express");
const router = express.Router({mergeParams : true});
const asyncWrap = require("../utils/asyncWrap.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middlewares.js");
const ReviewController = require("../controllers/reviews.js");

//Add review
router.post("/",
  isLoggedIn,
  validateReview,
  asyncWrap(ReviewController.createReview));
  
  //Delete Review 
router.delete("/:reviewId",
  isLoggedIn,
  isAuthor,
  asyncWrap(ReviewController.destroyReview));

  module.exports = router;
  