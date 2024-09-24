const SendMsg = require("../Shema/msgS")

// send message
exports.sendAmessageToAnAdmin= async(req,res)=>{
    const sendmsg = new SendMsg({
        phoneNumber:req.body.numberPhone,
        username:req.body.username,
        users:[req.body.from,"66dc7c727c0470b9d4889325"],
        from:req.body.from,
        to:"66dc7c727c0470b9d4889325",
        text: req.body.text
    })
    await sendmsg.save()
    res.json(sendmsg)
}

// get All message
exports.getAllMessage = async(req,res)=>{
    const msgs = await SendMsg.find()
    res.json(msgs)
}