import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    categoryName: {
        type: Schema.Types.String,
        required: 'Category name is required',
        unique: true
    },
    imageUrl : {
        type: Schema.Types.String,
        required: 'Category image is required',
    }
})

export default model('category', categorySchema);