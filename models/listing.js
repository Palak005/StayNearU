const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    eLoc: {
        type : String,
        default: ()=>{
            if(this.eLoc === undefined || this.eLoc === ''){
                return '9QGXAM';
            }
            return this.eLoc;
        },
    }

});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;