if(process.env.NODE_ENV != "production") {
  //dotenv will be used only in development stage afterwards we will switch;
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const AtlasDb_Url = process.env.ATLASDB_URL;
console.log(AtlasDb_Url);
const Mongoose_Path = 'mongodb://127.0.0.1:27017/StayNearU';
// C:\Program Files\MongoDB\mongosh-2.2.10-win32-x64\bin

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main()
  .then(() => {
    console.log("Connected to dbs");
  })
  .catch(err => {
    console.log(err)
  });

async function main() {
  // await mongoose.connect(Mongoose_Path);
  await mongoose.connect(AtlasDb_Url);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.listen(8080, ()=>{
    console.log("listening through port 8080");
});

const store = MongoStore.create({
  mongoUrl: AtlasDb_Url,
  touchAfter: 24 * 3600 ,
  crypto : {
    secret: process.env.SECRET,
  }
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 2*24*60*60*1000,
    maxAge: 2*24*60*60*1000,
    httpOnly: true,  //prevents XSS
  }
}

app.use(session(sessionOptions));
app.use(flash());

//insuring passport is being used for every path
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// using static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());//Storing User realted info in the session
passport.deserializeUser(User.deserializeUser());//remove information as the session ends

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.eloc = req.eloc;
  next();
}) 

app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter);
app.use("/listings", listingRouter);

//Error Handling
app.all('*', (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
  let {status = 500, message = "Someth ing went wrong"} = err;
  res.status(status).render("error.ejs", {err});
})












