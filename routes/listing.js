const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(asyncWrap(ListingController.index))
  .post(isLoggedIn, 
    upload.single('listing[image]'),
    validateListing, 
    asyncWrap(ListingController.addListing))

//Add New
router.get("/new", isLoggedIn, ListingController.renderNewForm);

router
  .route("/:id")
  .get(asyncWrap(ListingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    asyncWrap(ListingController.editListing))
  .delete(
    isLoggedIn,
    isOwner,
    asyncWrap(ListingController.destroyListing))

//Edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(ListingController.renderEditForm));

module.exports = router;