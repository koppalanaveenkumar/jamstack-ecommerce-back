import { Schema, model } from 'mongoose';

const validateEmail = function(email: string) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const userSchema = new Schema({
    firstName : {
        type: Schema.Types.String,
        required: 'Firstname is required'
    },
    lastName : {
        type: Schema.Types.String,
        required: 'Firstname is required'
    },
    email: {
        type: Schema.Types.String,
        required: 'Email is required',
        validate : [validateEmail, 'email id is not approprite']
    },
    phoneNo: {
        type: Schema.Types.Number,
        required: 'Phone Number is required',
    },
    password: {
        type: Schema.Types.String,
        required: 'Password is required'
    },
    isActive:{
        type: Schema.Types.Boolean,
        default: true,
        required: true,
    },
    lastLoggedIn: {
        type: Schema.Types.String
    }
})

export default model('users', userSchema);