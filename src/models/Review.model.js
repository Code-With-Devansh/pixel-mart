import mongoose, { mongo } from "mongoose"; 
const reviewSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'product'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating:{
        type: Number,
        required: true,
        enum: [1, 5],
    },
    title:{
        type: String,
        trim: true,
    },
    review:{
        type: String,
        trim: true,
    },
    
    deletedAt: {
        type: Date,
        trim:null,
        index:true
    },


}, {timestamps: true})


const ReviewModel = mongoose.models.review || mongoose.model('review', reviewSchema, 'reviews');
export default ReviewModel;