"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    categoryName: {
        type: mongoose_1.Schema.Types.String,
        required: 'Category name is required',
    }
});
exports.default = mongoose_1.model('category', categorySchema);
//# sourceMappingURL=category.model.js.map