const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required : true,
        trim: true, //حدف الفراغات من اول واخر سترينك
        minLength : 2,
        maxLength : 100,
    },
    email:{
        type:String,
        required : true,
        trim: true, //حدف الفراغات من اول واخر سترينك
        minLength : 5,
        maxLength : 100,
        unique : true,//لا يمكن تكرار الامايل
    },
    bio:{
        type:String,
        default:' فنان تشكيلي متخصص في تحويل الأفكار والمشاعر إلى لوحات نابضة بالحياة. أستوحي أعمالي من الطبيعة، الثقافة، والتجارب الشخصية، وأهدف إلى استكشاف عوالم جديدة من خلال الألوان والخطوط. شاركت في العديد من المعارض المحلية والدولية، وأعمل على إحداث تأثير إيجابي من خلال الفن الذي يعكس الجمال والعمق الإنساني',
        required : true,
        trim: true, //حدف الفراغات من اول واخر سترينك
    },
    password:{
        type:String,
        required : true,
        trim: true, //حدف الفراغات من اول واخر سترينك
        minLength : 8,
    },
    profilePhoto :{
        type : Object,
        default:{
            //صورة بالشكل التالي لكل مستخدك جديد
            url:"https://img.favpng.com/25/13/19/samsung-galaxy-a8-a8-user-login-telephone-avatar-png-favpng-dqKEPfX7hPbc6SMVUCteANKwj.jpg",
            publicId: null,
        }
    },
    instagram:{
        type:String,
        required:false,
        trim:true,
    },
    facebook:{
        type:String,
        required:false,
        trim:true,
    },
    tiktok:{
        type:String,
        required:false,
        trim:true,
    },
    website:{
        type:String,
        required:false,
        trim:true,
    },
    whatsapp:{
        type:String,
        required:false,
        trim:true,
    },
    isAdmin: {
        type : Boolean,
        default : false,
    },
    isAccountVerified: {
        type : Boolean,
        default : false,
    },
    isEmailVerified: {
        type : Boolean,
        default : false,
    },
},{
    timestamps : true,
    toJSON   : {virtuals : true},
    toObject : { virtuals : true}
})
// إنشاء العلاقة الافتراضية مع موديل المنشورات
UserSchema.virtual("posts", {
    ref : "new-post",
    foreignField:"user",
    localField: "_id"
})
// إنشاء العلاقة الافتراضية مع موديل المنشورات
UserSchema.virtual("public", {
    ref : "new-public",
    foreignField:"user",
    localField: "_id"
})
// التعاليق
UserSchema.virtual("notification", {
    ref : "new-notif-elfanane",
    foreignField:"user",
    localField: "_id"
})

//generete token
UserSchema.methods.generateAuthoken = function() {
    return jwt.sign({id: this._id, isAdmin:this.isAdmin}, process.env.JWT_Scrite , {
        // expiresIn : '30d' modate asala7ya
    })
}


const User = mongoose.model('Elfanane-auth-user',UserSchema)

module.exports = {
    User,
}