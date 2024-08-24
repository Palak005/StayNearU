const mongoose = require("mongoose");
const dataList = require("./data.js");
const Listing = require("../models/listing.js");

const Mongoose_Path = 'mongodb://127.0.0.1:27017/StayNearU';

main().then(() =>{
    console.log("connnected to database");
}).catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongoose_Path);
}

const initDB = async() =>{
    await Listing.deleteMany();
    dataList.data = dataList.data.map((object) => ({...object, owner : '66af804ab2f9ba03f942d857'}));
    await Listing.insertMany(dataList.data);
    console.log("Data was initialized");
}

initDB();