import { Schema, model } from "mongoose";

const addItemSchema = new Schema({
    categoryId: {
        type : Schema.Types.ObjectId,
        ref : "category",
        required : true
    },
    productName: {
        type: Schema.Types.String,
        required: 'Product name is required'
    },
    description : {
        type: Schema.Types.String,
        required: 'Product description is required'
    },
    brand: { 
        type: Schema.Types.String,
        required: 'Brand Name is required'
    },
    color: {
        type: Schema.Types.String,
        required: 'Product Color is required',
    },
    price: {
        type: Schema.Types.Number,
        required: 'Product price is required'
    },
    images : {
        type: Schema.Types.String,
        required: 'Product image is required',
    },
    countInStock: {
        type: Schema.Types.Number,
        required: 'Quantity is required'
    },
    manufacture: {
        type: Schema.Types.String,
        required: 'Data is required'
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    },
})
export default model('categoryItems', addItemSchema);