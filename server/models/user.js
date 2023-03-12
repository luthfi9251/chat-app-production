const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    conversationId: String,
    accpeted: {
        type: Number,
        default: 0
    },
    requestBy: String,
    member: Array
}, { timestamps: true })

const userSchema = new Schema({
    authType: String,
    authId: String,
    name : String,
    username : String,
    email : String,
    profilePicture : String,
    friends : [  friendSchema ]
})


module.exports = mongoose.model('User', userSchema);