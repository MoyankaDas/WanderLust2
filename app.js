if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
//session and flash
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
//authentication annd authorization
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");
const bookingsRoute = require('./routes/booking.js');

const userRoutes = require('./routes/users');
const wishlistRoutes = require("./routes/wishlist");
const balanceRoutes = require("./routes/balance");


let dbURL=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbURL);
}

main().then((res)=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')));

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});

store.on("error",(err)=>{
    console.log(err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        secure: process.env.NODE_ENV === "production"
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log("Current user:", req.user);
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);
app.use("/",bookingsRoute);
app.use('/users', userRoutes);
app.use("/", wishlistRoutes);
app.use(balanceRoutes);


app.listen(8080,()=>{
    console.log("app listening");
})


//...............
//error handling for all non-route pages
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=401,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

