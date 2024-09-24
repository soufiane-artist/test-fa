const mongoose = require('mongoose')

const newNotif =new mongoose.Schema({
    text : {
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    textLink:{
        type:String,
        required:true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Elfanane-auth-user",
        required:true,
    },
},{
    timestamps :true
})

const Notif = mongoose.model('new-notif-elfanane', newNotif)
module.exports = Notif