"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: mongoose_1.Schema.Types.String,
        required: 'Firstname is required'
    },
    lastName: {
        type: mongoose_1.Schema.Types.String,
        required: 'Firstname is required'
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        required: 'Email is required',
        validate: [validateEmail, 'email id is not approprite']
    },
    phoneNo: {
        type: mongoose_1.Schema.Types.Number,
        required: 'Phone Number is required',
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: 'Password is required'
    },
    isActive: {
        type: mongoose_1.Schema.Types.Boolean,
        default: true,
        required: true,
    },
    lastLoggedIn: {
        type: mongoose_1.Schema.Types.String
    }
});
exports.default = mongoose_1.model('users', userSchema);
//# sourceMappingURL=user.model.js.map