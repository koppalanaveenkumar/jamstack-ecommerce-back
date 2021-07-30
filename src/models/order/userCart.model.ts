import { Schema, model } from 'mongoose';

const userCart = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        required: "Product ID required"
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

export default model('UserCart', userCart);