"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    lastName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        validate: [validateEmail, 'email id is not approprite'],
        required: true,
    },
    phoneNo: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true
    }
});
exports.default = mongoose_1.model('users', userSchema);
//# sourceMappingURL=user.model.js.map