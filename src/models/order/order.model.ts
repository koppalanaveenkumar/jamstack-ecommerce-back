import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: 'user Id is required',
    },
    productIds: [{
        product1 : {
            type: Schema.Types.ObjectId,
            required: 'Product Id is required',
        },
        product2 : {
            type: Schema.Types.ObjectId
        }
    }],
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
        default: 'Pending'
    },
    dateOrderd: {
        type: Schema.Types.Date,
        default: new Date()
    },
    paymentId: {
        type: Schema.Types.String,
    }
})

export default model('order', orderSchema);