const path = require('path')
const multer = require('multer')

//photo Storage 
const PhotoStorage = multer.diskStorage({
    destination:function(req,file,cb) {
        cb(null,path.join(__dirname,"../images"))
    },

    filename: function(req,file,cb) {
        if (file) {
            cb(null, new Date().toISOString().replace(/:/g,"-")+ file.originalname)
        } else {
            cb(null, false)
        }
    }
})
//photo Uploade Midllewares
const photoUplaod = multer ({
    storage : PhotoStorage,
    fileFilter : function(req,file,cb) {
        if(file.mimetype.startsWith("image")) {
            cb(null , true)
        } else {
            cb({ message : "unsopported file formate "},false)
        }
    },
    limits :{ fileSize : 1024 * 10024} // 1megabyt
});

module.exports = photoUplaod 