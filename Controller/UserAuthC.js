const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')//1
const {User} = require('../Shema/UserAuth');
const path = require('path')
const fs =require('fs')
const { Post } = require("../Shema/PostsSchema")
const { cloudinaryUploadeImage, cloudinaryRemoveImage, cloudinaryRemoveAllImage } = require('../utils/Cloudinary');
/*const { verrfyTokenModel } = require('../schema/verficationToken');
//تستخدم في كتابة عشوائية
const crypto = require('crypto')
const  setEmail  = require('../utils/sendEmail'); // استبدل 'sendEmail' بالمسار الصحيح لملف sendEmail
*/
//______________________________
/**..................
 * @desc register new User
 * @router /api/auth/register
 * @method POST
 * @access public
..................... */
module.exports.registerUserUrl = asyncHandler(async(req,res)=>{
    //البحث في قاعدة البيانات هل يوجد هدا المستخدم من ثبل
    let user = await User.findOne({
        email: req.body.email
    })
    if(user){
        return res.json({message : 'هادا المستخدم موجود من قبل'})
    }
  
    let usernameOne = await User.findOne({
        username: req.body.username
    })
    if(usernameOne){
        return res.json({message : 'هادا الاسم موجود  سبقا'})
    }
  
    //bcrypt ____//تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
   
    const capitalizeFirstLetter = (str) => {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    // تحويل اسم المستخدم
    const username = capitalizeFirstLetter(req.body.username);

    user = new User({
        username: username,
        email : req.body.email.toLowerCase() ,
        password : hashedPassword ,// تشفير كلمة المرور
        instagram : ' غير موجود',
        facebook : ' غير موجود',
        tiktok : ' غير موجود',
        website : ' غير موجود',
        whatsapp : ' غير موجود'
    })
    await user.save()
   /*1*///verfy email
    //creating new verfication & save it toDB
 /*  const verifytoken = new verrfyTokenModel({
        userId : user._id,
        //يكتب كتابة عشوائية
        token : crypto.randomBytes(32).toString("hex"),
    });
    await verifytoken.save()
    //انشاء لينك
    const link = `${process.env.CLIENT_DOMAIN}/${user._id}/verify/${verifytoken.token}`;
    //انشاءاتشتيميل لتكون احلى
    const htmlTemplate = `
        <div>
            <p>  click on the Link below to verify your email  </p>
            <a href="${link}">  Verify  </a>
        </div>
    `
    //ارسال البيانات الى قسم سيند ايمايل حسب الترتيب
    await setEmail(user.email, "Verify your email", htmlTemplate);
   */ //res

   // res.status(201).json({message : 'We send to you an email,please verfy email address'})
    res.json(user)
})

/**..................
 * @desc Logiin  User
 * @router /api/auth/Loign
 * @method POST
 * @access public
..................... */

module.exports.loginUser= asyncHandler(async(req,res)=>{

    // البحث في قاعدة البيانات على الامايل
    const user = await User.findOne({email : req.body.email.toLowerCase()});
    if(!user) {
        return res.json({message : 'invalid email or password'})
    }
        // البحث في قاعدة البيانات على كلمة السر
    const isPosswordMatch = await bcrypt.compare(req.body.password, user.password)
    if(!isPosswordMatch) {
        return res.json({message : 'invalid email or password'})
    }
   //ادا كلن حساب المستخدم ليت فيريفي لا تسمح بستجيل الدخول
   /*if(!user.isAccountVerified){

    let verficationToken = await verrfyTokenModel.findOne({
        userId  : user._id
    })
    // ارسال رسالة لليوزر ليدخل عبر الايمايل الخاص به
    if(!verficationToken){
        verficationToken = new verrfyTokenModel({
            user : user._id,
            token : crypto.randomBytes(32).toString("hex")
        })
        await verficationToken.save()
    }
    //انشاء لينك
    const link = `${process.env.CLIENT_DOMAIN}/${user._id}/verify/${verficationToken.token}`;
    //انشاءاتشتيميل لتكون احلى
    const htmlTemplate = `
        <div>
            <p>  click on the Link below to verify your email  </p>
            <a href="${link}">  Verify  </a>
        </div>
    `
    //ارسال البيانات الى قسم سيند ايمايل حسب الترتيب
    await setEmail(user.email, "Verify your email", htmlTemplate);
    //res
  

    return res.status(400).json({message : "we sent to you an email, please verify your email address"})
   }
*/


    //انشاء توكد بعد الدخول
    const token = user.generateAuthoken();
    res.status(200).json({
        _id:user._id,
        isAdmin:user.isAdmin,
        token,
        profilePhoto : user.profilePhoto,
        username:user.username,
        createAd :user.createdAt,
        bio : user.bio? user.bio : "null",
        email : user.email,
        instagram : user.instagram,
        facebook : user.facebook,
        tiktok : user.tiktok,
        website : user.website,
        whatsapp : user.whatsapp,
        isAccountVerified : user.isAccountVerified,
    })
})

/**..................
 * @desc get User by id
 * @router /api/users/profile/:id
 * @method GetById
 * @access public
..................... */

exports.getuserbyId = asyncHandler (async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password").populate("posts").populate('notification')
    if(!user) {
        return res.status(401).json({ msg : "user not found" })
    } else {
        res.status(200).json(user)
    }
})

// get Count Users
module.exports.getCountUser = asyncHandler(async(req,res)=>{
    const getUserLength = await User.countDocuments()
    res.json(getUserLength)
})


/**..................
 * @desc get User by id
 * @router /api/auth/:userId/verify/:token
 * @method GET
 * @access public
..................... */


 /*module.exports.verfyUserAccountCtrl = asyncHandler(async (req, res) => {
    //من الرابط جلب اليوزر
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.json({ message: "invalid link" });
    }

    //التاكد من التوكن هل هو صحيح جلب التوكن من الرابط
    const verifycationToken = await verrfyTokenModel.findOne({
        userId: user._id,
        token: req.params.token
    });

    //ادا لم يكن لدينا
    if (!verifycationToken) {
        return res.json({ message: 'invalid Link' });
    }

    // تعديل الفيريفيكايشن 
    user.isAccountVerified = true;
    await user.save();

    //حدف الفيريفيكايشن لليزير لتكون صلاحيتها مدة واحدة    
    res.json({ message: 'your account verify' });
});*/

//Update_Img_Profile
exports.UpdateImageProfile = (async(req,res)=>{

    const user = await User.findById(req.params.id)
    if(!user){
        return res.json({message : 'user not found'})
    }

    const pathImg = path.join(__dirname,`../images/${req.file.filename}`)
    const image = await cloudinaryUploadeImage(pathImg)
    
    if (user?.profilePhoto?.publicId !== null) {
        await cloudinaryRemoveImage(user?.profilePhoto?.publicId);
    }
    const userPhoto = await User.findByIdAndUpdate(req.params.id,{
    $set:{
        profilePhoto : {
            url : image.url,
            publicId : image.public_id,
        }
    }
    },{new : true})

    await userPhoto.save()

    res.json(userPhoto)
    fs.unlinkSync(pathImg)
})

exports.deleteUserid = async(req,res)=>{
 // 1 get the user from db
 const user = await User.findById(req.params.id)
 if(!user) {
     return res.status(404).json({ message : "user not found" })
 }
 //@get all poste from db of hes User
 const posts = await Post.find({user:  user._id })
 //@todo get public ids from the posts
 const publicIds = posts?.map((post)=> post.image.publicId)
 //Delte all post image of hes user
 if(publicIds?.length > 0 ) {
     await cloudinaryRemoveAllImage(publicIds)
 } 
 // 5. حذف الصورة الشخصية القديمة إذا كانت موجودة
 if(user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
}
 //@DELTE user post and comment
 await Post.deleteMany({ user : user._id})
 //send 
await User.findByIdAndDelete(req.params.id)
res.status(201).json({ Delete : "User hasbeen Delected "})

}
// verufy acount
module.exports.UpdateVerifyAccount = asyncHandler(async(req,res)=>{
   
    const user =await User.findById(req.params.id)
    if(!user){
        return res.json({message : 'user not found'})
    }
    user.isAccountVerified = true
    await user.save()
    res.json(user)
})