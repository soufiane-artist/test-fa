const express = require('express');
const photoUplaod = require('../middlewares/photoAploade');
const { creatnewPost, getAllposts, getsinglePost, UpdateAllviews, deletePost, updatePost, creatnewpublicitier, getAllPublic, getsinglePub, updatePub, UpdateAllviewsPub, deletePostByid } = require('../Controller/Posts');
const router = express.Router()

// api/posts
router.post("/post",photoUplaod.single("image"),creatnewPost);
router.get('/posts',getAllposts)
router.get('/post/:id',getsinglePost)
router.get('/posts/views',UpdateAllviews)
// delete post 
router.delete('/post/:id',deletePost)
//update post
router.put('/post/update/:id',updatePost)
// publicier 
router.post("/publicier",photoUplaod.single("image"),creatnewpublicitier);
router.get("/publiciers",getAllPublic);
router.get("/publicier/:id",getsinglePub);
router.put("/publicier/:id",updatePub);
router.get('/publiciers/views',UpdateAllviewsPub)

module.exports = router