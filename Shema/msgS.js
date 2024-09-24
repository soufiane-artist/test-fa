const mongoose = require('mongoose')

const newMessage =new mongoose.Schema({
    text : {
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    users:Array,
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Elfanane-auth-user",
        trim:true,
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Elfanane-auth-user",
        trim:true,
        required:true
    }
},{
    timestamps :true
})

const SendMsg = mongoose.model('new-message-an-admin', newMessage)
module.exports = SendMsg