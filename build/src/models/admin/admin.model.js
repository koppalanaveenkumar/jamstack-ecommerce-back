"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const adminSchema = new mongoose_1.Schema({
    username: {
        type: mongoose_1.Schema.Types.String,
        required: 'Firstname is required'
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        required: 'Email is required',
        validate: [validateEmail, 'email id is not approprite']
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: 'Password is required'
    },
    isAdmin: {
        type: mongoose_1.Schema.Types.Boolean,
        default: true,
        required: true,
    },
    lastLoggedIn: {
        type: mongoose_1.Schema.Types.String
    }
});
exports.default = mongoose_1.model('admin', adminSchema);
//# sourceMappingURL=admin.model.js.map