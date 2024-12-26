const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture:{
     type:String,
    },
    notifications: {
        newProperty: { type: Boolean, default: true },
        bidActivity: { type: Boolean, default: true },
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    verificationToken: {
        type: String, 
        default: null 
    },
    verificationCode: {
        type: String,
        default: null
    },
    verificationCodeExpiry: {
        type: Date,
        default: null
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
