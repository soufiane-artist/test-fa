const asyncHandler = require('express-async-handler')
const {User} = require('../Shema/UserAuth')
const bcrypt = require('bcryptjs')
const fs = require('fs')
/*const path = require('path')
const fs = require('fs')
const { cloudinaryUploadeImage,cloudinaryRemoveAllImage ,cloudinaryRemoveImage } = require('../utils/Cloudinary')
const {Comment} = require('../schema/comment')
const {Post} = require('../schema/PostShema')
*/
/**..................
 * @desc getUsers
 * @router /api/users/profile
 * @method GetUsers
 * @access private (only admin)
..................... */

exports.getAllUsers = asyncHandler (async(req,res)=>{
    const users = await User.find().select("-password")
    res.status(200).json(users)
})

// تعريف الدالة لتحديث جميع المستخدمين
exports.updateAllUsers = asyncHandler(async (req, res) => {
    const { username } = req.body; // استخراج اسم المستخدم من جسم الطلب
    const updatedUsers = await User.updateMany({}, { username }); // تحديث جميع المستخدمين بالاسم المعطى
    res.json(updatedUsers);
});

/**..................
 * @desc get User by id
 * @router /api/users/profile/:id
 * @method GetById
 * @access public
..................... */

exports.getuserbyname = asyncHandler (async(req,res)=>{

    const user  = await User.findOne({username:req.body.username}).select("-password").populate("posts").populate('public').populate('notification')
    res.json(user)

    /*const user = await User.findById(req.params.id).select("-password").populate("posts")
    if(!user) {
        return res.status(401).json({ msg : "user not found" })
    } else {
        res.status(200).json(user)
    }*/
})

/**..................
 * @desc Update User by id
 * @router /api/users/profile/:id
 * @method PUT
 * @access private (only user himself)
..................... */


module.exports.updateUserProfil = asyncHandler (async(req,res)=>{
    //UpdatePassword
    if(req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password,salt)
    }

    const UpdateUser = await User.findByIdAndUpdate(req.params.id,{
        $set: {
            username : req.body.username,
            password : req.body.password,
            bio : req.body.bio
        }
    },{new : true}).select("-password").populate('posts')
   res.status(201).json(UpdateUser)
})



/**..................
 * @desc  Uploade phtoProfile
 * @router /api/users/profile/profilePhoto
 * @method Uploade
 * @access private (only user himself)
..................... */

module.exports.PhotoProfileUploade = asyncHandler(async(req,res)=>{
    // 1. التحقق من صحة البيانات
    if(!req.file) {
        return res.status(400).json({ message : 'لم يتم توفير ملف'})
    }
    // 2. الحصول على مسار الصورة
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    // 3. رفع الصورة إلى Cloudinary
    const result = await cloudinaryUploadeImage(imagePath)
    // 4. الحصول على المستخدم من قاعدة البيانات
    const user =await User.findById(req.user.id)
    // 5. حذف الصورة الشخصية القديمة إذا كانت موجودة
    if(user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
    // 6. تغيير حقل الصورة الشخصية في قاعدة البيانات
    user.profilePhoto = {
        url : result.secure_url,
        publicId : result.public_id
    }
    await user.save()
    // 7. إرسال الاستجابة
    res.status(200).json({msg : "تم تحميل صورتك الشخصية بنجاح",
    profilePhoto : { url: result.secure_url,publicId : result.public_id}
})
    // 8. حذف الصورة من الخادم
    fs.unlinkSync(imagePath)
})

/**..................
 * @desc  Update phtoProfile
 * @router /api/users/profile/profilePhoto
 * @method Update
 * @access private (only user himself)
..................... */

module.exports.UpdatePhotoProfile = asyncHandler(async(req,res)=>{
    // 1. التحقق من صحة البيانات
    if(!req.file) {
        return res.status(400).json({ message : 'لم يتم توفير ملف'})
    }
    // 2. الحصول على مسار الصورة
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    // 3. رفع الصورة إلى Cloudinary
    const result = await cloudinaryUploadeImage(imagePath)
    // 4. الحصول على المستخدم من قاعدة البيانات
    const user =await User.findById(req.user.id)
    // 5. حذف الصورة الشخصية القديمة إذا كانت موجودة
    if(user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
    // 6. تغيير حقل الصورة الشخصية في قاعدة البيانات
    user.profilePhoto = {
        url : result.secure_url,
        publicId : result.public_id
    }
    await user.save()
    // 7. إرسال الاستجابة
    res.status(200).json({msg : "تم تحميل صورتك الشخصية بنجاح",
    profilePhoto : { url: result.secure_url,publicId : result.public_id}
})
    // 8. حذف الصورة من الخادم
    fs.unlinkSync(imagePath)
})


/**..................
 * @desc  Delete User by id
 * @router /api/users/profile/:id
 * @method delete
 * @access private (only user himself)
..................... */


module.exports.DeletUserByid = asyncHandler (async(req,res)=>{
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
    // delete image profil 
    if(user.profilePhoto.publicId !== null ){
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    //@DELTE user post and comment
    await Post.deleteMany({ user : user._id})
    await Comment.deleteMany({ user : user._id})

    

    //send 
   await User.findByIdAndDelete(req.params.id,)
   res.status(201).json({ Delete : "User hasbeen Delected "})
})

// edit - all - profile
exports.updateAllprofile =(async(req,res)=>{

    const userName = await User.findOne({username : req.body.username})
    if(userName){
        return res.json({messageV : "هدا الاسم متوفر يالفعل"})
    }

    const user = await User.findById(req.params.id)
    if(!user){
        return res.json({messageV : 'user not found'})
    }

    await User.findByIdAndUpdate(req.params.id , {
        $set:{
            username :req.body.username ? req.body.username : user?.username  ,
            bio:req.body.bio ?req.body.bio : user?.bio  ,
            instagram:req.body.instagram ?req.body.instagram : user?.instagram  ,
            facebook:req.body.facebook ?req.body.facebook : user?.facebook  ,
            tiktok:req.body.tiktok ?req.body.tiktok : user?.tiktok  ,
            website:req.body.website ?req.body.website : user?.website  ,
            whatsapp:req.body.whatsapp ?req.body.whatsapp : user?.whatsapp  ,
        }
    },{new:true})
    await user.save()
    res.json({message :'تم تحديث الحساب بنجاح'})
})
