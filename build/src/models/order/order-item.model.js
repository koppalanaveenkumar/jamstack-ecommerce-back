"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: "Product ID required"
    }
});
exports.default = mongoose_1.model('orderitem', orderItemSchema);
//# sourceMappingURL=order-item.model.js.map