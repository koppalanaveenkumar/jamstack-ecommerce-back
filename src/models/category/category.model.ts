import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    categoryName: {
        type: Schema.Types.String,
        required: 'Category name is required',
        unique: true
    }
})

export default model('categorie', categorySchema);