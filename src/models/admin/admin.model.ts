import { Schema, model } from 'mongoose';

const validateEmail = function(email: string) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const adminSchema = new Schema({
    username : {
        type: Schema.Types.String,
        required: 'Firstname is required'
    },
    email: {
        type: Schema.Types.String,
        required: 'Email is required',
        validate : [validateEmail, 'email id is not approprite']
    },
    password: {
        type: Schema.Types.String,
        required: 'Password is required'
    },
    isAdmin:{
        type: Schema.Types.Boolean,
        default: true,
        required: true,
    },
    lastLoggedIn: {
        type: Schema.Types.String
    }
})

export default model('admin', adminSchema);