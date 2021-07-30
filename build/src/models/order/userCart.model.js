"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userCart = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: "Product ID required"
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
});
exports.default = mongoose_1.model('UserCart', userCart);
//# sourceMappingURL=userCart.model.js.map