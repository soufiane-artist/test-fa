const cloudinary = require('cloudinary')

// تهيئة مكتبة Cloudinary باستخدام المتغيرات المحددة من process.env
cloudinary.config({
    cloud_name: process.env.CLOUD_DUNAME, // اسم السحابة
    api_key : process.env.CLOUD_API_key , // مفتاح API
    api_secret : process.env.CLOUD_API_SECRIT // سر API
})

// وظيفة لرفع الصور إلى Cloudinary
const cloudinaryUploadeImage = async(fileToUpload)=>{
    try {
        const data = await cloudinary.uploader.upload(fileToUpload , {
            resourse_type : 'auto',
        });
        return data; // إرجاع بيانات الصورة بعد الرفع
    } catch (error) {
        console.log(error)
        throw new Error("internal server error (cloudnary"); // إرجاع أي خطأ في حال حدوثه
    }
}

// وظيفة لحذف الصور من Cloudinary
const cloudinaryRemoveImage = async(imagePublicId)=>{
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId)
        return result; // إرجاع نتيجة عملية الحذف
    } catch (error) {
        console.log(error)
        throw new Error("internal server error (cloudnary"); // إرجاع أي خطأ في حال حدوثه
    }
}
// وظيفة لحذف الصور من Cloudinary
const cloudinaryRemoveAllImage = async(publicId)=>{
    try {
        const result = await cloudinary.v2.api.delete_resources(publicId)
        return result; // إرجاع نتيجة عملية الحذف
    } catch (error) {
        console.log(error)
        throw new Error("internal server error (cloudnary"); // إرجاع أي خطأ في حال حدوثه
 // إرجاع أي خطأ في حال حدوثه
    }
}

// تصدير الوظائف لتكون متاحة للاستخدام في ملفات أخرى
module.exports = {
    cloudinaryUploadeImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveAllImage
}
