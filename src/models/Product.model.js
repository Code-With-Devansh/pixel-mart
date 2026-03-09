import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    slug: {
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true
    },    
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },  
    mrp:{
        type: Number,
        required: true,
    },  
    sellingPrice:{
        type: Number,
        required: true,
    },  
    discountPercentage:{
        type:Number,
        required: true,
    },  
    description:{
        type:string,
    },  
    media:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'media',
            required: true,
        }
    ],  
    deletedAt: {
        type: Date,
        trim:null,
        index:true
    },
}, {timestamps: true})

productSchema.index({category:1})

const ProductModel = mongoose.models.product || mongoose.model('product', productSchema, 'products');
export default ProductModel;