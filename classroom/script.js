const express=require("express");
const app=express();
// const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.listen(3000,()=>{
    console.log("connected");
})

//cookie...
// app.use(cookieParser("secretCode"));

// app.get("/cookie",(req,res)=>{
//     res.cookie("name","Moyanka",{signed:true});
//     res.send("send");
// })

// app.get("/getCookies",(req,res)=>{
//     let {name="hello"}=req.signedCookies;
//     console.log(name);
// })



// express-session...
let sessionOptions={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionOptions));

// app.get("/register",(req,res)=>{
//     let {name}=req.query;
//     req.session.name=name;
//     res.send(`Hello ${req.session.name}`);
// })

// app.get("/hello",(req,res)=>{
//     res.send(`Hi ${req.session.name}`);
// })


// connect-flash...
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})
app.get("/register",(req,res)=>{
    let {name="anynomous"}=req.query;
    req.session.name=name;
    if(name==="anynomous"){
        req.flash("error","You are not in my page");
    } else {
        req.flash("success","You are in my page");
    }
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
})