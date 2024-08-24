const User = require("../models/user");

module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signUp.ejs");
};

module.exports.userSignup = async(req, res) =>{
    try{
        const {password, username, email} = req.body;
        const newUser = new User({email, username});

        let registeredUser = await User.register(newUser, `${password}`);
        req.login(registeredUser , (err) =>{
            if(err){
                return next(err);
            }
            else{
                req.flash("success", "User Registered Successfully");
                return res.redirect("/listings");  
            }
        })      
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/listings"); 
    } 
}

module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.userLogin = async(req, res) =>{
    req.flash("success", "Welcome back to StayNearU");
    let redirectUrl = res.locals.redirectUrl || "/Listings";
    res.redirect(redirectUrl); 
};

module.exports.userLogout = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success", "Successfully Logged Out");
            return res.redirect('/listings');
        }
    });
};
