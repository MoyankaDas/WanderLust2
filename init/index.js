const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const indianData=require("./indianData.js");

const atlasUri = "mongodb+srv://moyankadas:<db_password>@cluster0.5zwi1it.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function main(){
    await mongoose.connect("mongodb+srv://moyankadas:djxTZ3L2hRGrescY@cluster0.5zwi1it.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

main().then((res)=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err);
})

async function addListing(){
    // await Listing.deleteMany({});
    // initData.data=initData.data.map((obj)=>({...obj,owner:new mongoose.Types.ObjectId("68219c0be2f96b1977fcf027")}));
    // await Listing.insertMany(initData.data);
    indianData.indData=indianData.indData.map((obj)=>({...obj,owner:new mongoose.Types.ObjectId("68219c0be2f96b1977fcf027")}));
    await Listing.insertMany(indianData.indData);
    console.log("running");
}

addListing();