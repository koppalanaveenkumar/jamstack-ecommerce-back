"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'categoryItems',
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: mongoose_1.Schema.Types.Number,
        required: "Quantity is required"
    },
    shippingAddress1: {
        type: mongoose_1.Schema.Types.String,
        required: 'Shipping Address1 Required'
    },
    shippingAddress2: {
        type: mongoose_1.Schema.Types.String
    },
    city: {
        type: mongoose_1.Schema.Types.String,
        required: 'City Required Required'
    },
    zip: {
        type: mongoose_1.Schema.Types.Number,
        required: 'Zip Code Required'
    },
    country: {
        type: mongoose_1.Schema.Types.String,
        required: 'Country Required'
    },
    phoneNo: {
        type: mongoose_1.Schema.Types.Number,
        required: 'Phone NUmber Required'
    },
    totalPrice: {
        type: mongoose_1.Schema.Types.Number
    },
    status: {
        type: mongoose_1.Schema.Types.String,
        required: 'Status Required',
        default: 'Pending'
    },
    dateOrderd: {
        type: mongoose_1.Schema.Types.Date,
        default: new Date()
    }
});
exports.default = mongoose_1.model('orders', orderSchema);
//# sourceMappingURL=order.model.js.map