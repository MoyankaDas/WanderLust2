const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

main().then((res)=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err);
})

async function addListing(){
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"65d5a2de18e5b8d476547e6c"}));
    await Listing.insertMany(initData.data);
}

addListing();