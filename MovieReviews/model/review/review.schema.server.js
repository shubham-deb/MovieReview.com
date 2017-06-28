
var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
    movieName:{type: String},
    movieId:{type:String,required:true},
    text:String,
    rating:Number,
    username:String,
    userId: {type:mongoose.Schema.ObjectId , ref:'UserModel',required:true},
    posted: {type:Date, default:Date.now}
});

module.exports=reviewSchema;
