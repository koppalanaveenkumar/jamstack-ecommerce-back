"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categoryItemsSchema = new mongoose_1.Schema({
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    productName: {
        type: mongoose_1.Schema.Types.String,
        required: 'Product name is required'
    },
    description: {
        type: mongoose_1.Schema.Types.String,
        required: 'Product description is required'
    },
    brand: {
        type: mongoose_1.Schema.Types.String,
        required: 'Brand Name is required'
    },
    color: {
        type: mongoose_1.Schema.Types.String,
        required: 'Product Color is required',
    },
    price: {
        type: mongoose_1.Schema.Types.Number,
        required: 'Product price is required'
    },
    images: {
        type: mongoose_1.Schema.Types.String,
        required: 'Product image is required',
    },
    countInStock: {
        type: mongoose_1.Schema.Types.Number,
        required: 'Quantity is required'
    },
    manufacture: {
        type: mongoose_1.Schema.Types.String,
        required: 'Data is required'
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        default: Date.now()
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.model('product', categoryItemsSchema);
//# sourceMappingURL=product.model.js.map