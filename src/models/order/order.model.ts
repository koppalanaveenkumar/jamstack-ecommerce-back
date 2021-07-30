import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'categoryItems',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Schema.Types.Number,
        required: "Quantity is required"
    },
    shippingAddress1: {
        type: Schema.Types.String,
        required: 'Shipping Address1 Required'
    },
    shippingAddress2 : {
        type: Schema.Types.String
    },
    city: {
        type: Schema.Types.String,
        required: 'City Required Required'
    },
    zip: {
        type: Schema.Types.Number,
        required: 'Zip Code Required'
    },
    country: {
        type: Schema.Types.String,
        required: 'Country Required'
    },
    phoneNo: {
        type: Schema.Types.Number,
        required: 'Phone NUmber Required'
    },
    totalPrice: {
        type: Schema.Types.Number
    },
    status: {
        type: Schema.Types.String,
        required: 'Status Required',
        default: 'Pending'
    },
    dateOrderd: {
        type: Schema.Types.Date,
        default: new Date()
    }
})

export default model('orders', orderSchema);