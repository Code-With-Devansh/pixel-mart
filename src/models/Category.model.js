import mongoose, { mongo } from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true

    },
    slug: {
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true
    },    
    deletedAt: {
        type: Date,
        trim:null,
        index:true
    },
}, {timestamps: true})

const CategoryModel = mongoose.models.category || mongoose.model('category', categorySchema, 'categories');
export default CategoryModel;