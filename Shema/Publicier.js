const  mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required:true,
        trim : true,
        minLength : 2,
        maxLength :100,
    },
    description : {
        type : String,
        required:true,
        trim : true,
        minLength :6,
    },
    price:{
        type : Number,
        required:true,
        trim : true,
    },
    views:{
        type : Number,
        default:0,
        required:true,
        trim : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Elfanane-auth-user",
        required:true,
    },
    category:{
        type : String,
        required : true,
    },
    image: {
        type: Object,
        default: {
            url : "",
            publicId:null,
        }
    },
    /*likes: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]*/
},{
    timestamps: true,
    //استحضار الكومنت من قاعدة البيانات
    toJSON : {virtuals: true},
    toObject: {virtuals: true}
}
)
//polualte Comment For this Post
//استحضار الكومنت من قاعدة البيانات
/*
postSchema.virtual("comments", {
    ref : "comment",
    foreignField:"postId",
    localField: "_id"
})
*/
const Public = mongoose.model('new-public', postSchema)

module.exports = {
    Public,
}