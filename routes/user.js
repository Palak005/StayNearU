const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const {loginRoute} = require("../middlewares.js");
const UserController = require("../controllers/users.js");

router
    .route("/signup")
    .get(UserController.renderSignupForm)
    .post(asyncWrap(UserController.userSignup));


router
    .route("/login")
    .get(UserController.renderLoginForm)
    .post(
        loginRoute,
        passport.authenticate("local",{
            failureRedirect: "/users/login",
            failureFlash: true,
        }), 
        asyncWrap(UserController.userLogin)
    );

router.get("/logout", UserController.userLogout);
module.exports = router;
