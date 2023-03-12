const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    senderId: String,
    text: String
},{ timestamps: true }) 

const conversationSchema = new Schema({
    roomId: String,
    member: [ String ],
    messages: [ messagesSchema ]
}, { timestamps: true })


module.exports = mongoose.model('conversation', conversationSchema);