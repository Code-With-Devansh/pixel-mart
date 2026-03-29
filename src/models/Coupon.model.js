import mongoose, { mongo } from "mongoose";
const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        trim:true,
        unique:true
    },
    discountPercentage:{
        type: Number,
        required: true,
        trim:true   
    },
    minShoppingAmount:{
        type: Number,
        required: true,
        trim:true
    },
     validity:{
        type: Date,
        required: true,
        trim:true
     },
    deletedAt: {
        type: Date,
        trim:null,
        index:true
    },


}, {timestamps: true})


const CouponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema, 'coupons');
export default CouponModel;