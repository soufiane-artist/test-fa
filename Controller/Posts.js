
const { Post } = require("../Shema/PostsSchema")
const { cloudinaryUploadeImage, cloudinaryRemoveImage } = require("../utils/Cloudinary")
const path =require('path')
const fs = require("fs")
const { Public } = require("../Shema/Publicier")

/**..................
 * @desc Create new Post
 * @router /api/post
 * @method POST
 * @access private (only logged in user)
..................... */


module.exports.creatnewPost = (async(req,res)=>{
    
    //1 validation image
   /* if(!req.file){
        return res.status(401).json({ message : "no image providad"})
    }
    //2 validation data
    const {error} = validateCreatePost(req.body)
    if(error){
        res.status(401).json({ message : error.details[0].message})
    }*/
    //3 Upload Photo
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
    const result = await cloudinaryUploadeImage(imagePath)
    //4 create new post and save it to db
    const post = await Post.create({
        title : req.body.title,
        description : req.body.description,
        category : req.body.category,
        price:req.body.price,
        user: req.body.user,
        image : {
            url : result.secure_url,
            publicId : result.public_id
        }
    })
    //5. send response To client
    res.status(201).json(post)
    //6. remove photo from server
    fs.unlinkSync(imagePath)
})

module.exports.getAllposts = async(req,res)=>{
    const posts = await Post.find().sort({ createdAt: -1}).populate("user",["-password"]) 
    res.json(posts)
}


/**..................
 * @desc get post by id
 * @router /api/post
 * @method POST
 * @access public
..................... */

module.exports.getsinglePost= (async(req,res) => {

    const post = await Post.findById(req.params.id)
    .populate('user',['-password'])
    if(!post) {
        return res.status(401).json({ message :'post not found'})
    } 

res.status(200).json(post)
})

// update all posts
exports.UpdateAllviews = async (req, res) => {
    try {
      const posts = await Post.find();
      
      // Increment views for each post
      const postUpdateViews = await Post.updateMany(
        {}, // Empty filter to update all posts
        { $inc: { views: 1 } } // Increment views by 1 for each post
      );
      
      res.json(postUpdateViews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the views.' });
    }
  };

  module.exports.deletePost= (async(req,res) => {
    const post = await Post.findById(req.params.id)
    if(!post) {
        return res.status(401).json({ message :'post not found'})
    }
    
    await Post.findByIdAndDelete(req.params.id)
    //delete image at cloudnary
    await cloudinaryRemoveImage(post.image.publicId)
    res.json({message :'تم حدف المنشور بنجاح '})
})
//upadete post 
// edit - all - profile
exports.updatePost =(async(req,res)=>{

    const post = await Post.findById(req.params.id)

   const postT = await Post.findByIdAndUpdate(req.params.id , {
        $set:{
            title: req.body.title ,
            description: req.body.description ,
            price: req.body.price 
        }
    },{new:true})
    await postT.save()
    res.json({message : 'تم تعديل البوست بنجاح'})
})

//  publicitier

//create new
module.exports.creatnewpublicitier = (async(req,res)=>{
    
    //1 validation image
   /* if(!req.file){
        return res.status(401).json({ message : "no image providad"})
    }
    //2 validation data
    const {error} = validateCreatePost(req.body)
    if(error){
        res.status(401).json({ message : error.details[0].message})
    }*/
    //3 Upload Photo
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
    const result = await cloudinaryUploadeImage(imagePath)
    //4 create new post and save it to db
    const post = await Public.create({
        title : req.body.title,
        description : req.body.description,
        category : req.body.category,
        price:req.body.price,
        user: req.body.user,
        image : {
            url : result.secure_url,
            publicId : result.public_id
        }
    })
    //5. send response To client
    res.status(201).json(post)
    //6. remove photo from server
    fs.unlinkSync(imagePath)
})

// get All pub
module.exports.getAllPublic = async(req,res)=>{
    const posts = await Public.find().sort({ createdAt: -1}).populate("user",["-password"]) 
    res.json(posts)
}
// get by id
module.exports.getsinglePub= (async(req,res) => {

    const post = await Public.findById(req.params.id)
    .populate('user',['-password'])
    if(!post) {
        return res.status(401).json({ message :'post not found'})
    } 
    res.status(200).json(post)
})
// edit Pub
exports.updatePub =(async(req,res)=>{

    const post = await Public.findById(req.params.id)

   const postT = await Public.findByIdAndUpdate(req.params.id , {
        $set:{
            title: req.body.title ,
            description: req.body.description ,
            price: req.body.price 
        }
    },{new:true})
    await postT.save()
    res.json({message : 'تم تعديل الاعلان بنجاح'})
})
// update all posts
exports.UpdateAllviewsPub = async (req, res) => {
    try {
      const posts = await Public.find();
      
      // Increment views for each post
      const postUpdateViews = await Public.updateMany(
        {}, // Empty filter to update all posts
        { $inc: { views: 3 } } // Increment views by 1 for each post
      );
      
      res.json(postUpdateViews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the views.' });
    }
  };
  