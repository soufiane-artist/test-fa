const Notif = require("../Shema/Notification")


exports.newNotif= async(req,res)=>{
    const notif = await  Notif.create({
        text : 'نود أن نحييك بحرارة لوصولك إلى 2000 مشاهدة على موقع elfanane.com! هذا الإنجاز يعكس تقدير الجمهور لعملك الفني وإبداعك. نحن فخورون بوجودك ضمن مجتمع الفنانين المميزين على منصتنا',
        user: req.body.user,
        link :"توثيق-الحساب/"+req.body.user,
        textLink:'توثيق الحساي'
    })
    res.json({notif})
}

//طلب الدورة

exports.getCoures= async(req,res)=>{
    const notif = await  Notif.create({
        text: `قام المستخدم بطلب الدورة بعنوان "${req.body.course}" باستخدام رقم الهاتف ${req.body.numberPhone} (اسم المستخدم: ${req.body.username})`,
        user: "66ec23bea5b15ba483209703",
        link :"test",
        textLink:'test'
    })
    res.json({notif})
}

// طلب التوثيق

exports.getverfyAccount= async(req,res)=>{
    const notif = await  Notif.create({
        text : `قام المستخدم ${req.body.username} بطلب توثيق الحساب برقم الهاتف ${req.body.numberPhone} (${req.body.userId})`,
        user: "66ec23bea5b15ba483209703",
        link :"توثيق-الحساب/66ec23bea5b15ba483209703",
        textLink:'توثيق الحساب'
    })
    res.json({message : 'تم تقديم الطلب بنجاح'})
}


// طلب شهادة

exports.getChahada= async(req,res)=>{
    const notif = await  Notif.create({
        text: `رابط الصورة: ${req.body.linkImg} - العمر: ${req.body.age} - قام المستخدم ${req.body.username} بطلب شهادة برقم الهاتف ${req.body.numberPhone} (${req.body.userId})`,
        user: "66ec23bea5b15ba483209703",
        link :req.body.linkImg,
        textLink:'توثيق الحساي'
    })
    res.json({message : 'تم تقديم الطلب بنجاح'})
}


