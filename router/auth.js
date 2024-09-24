const express = require('express')
const router = express.Router()
const {registerUserUrl ,loginUser, getuserbyId, getCountUser, UpdateImageProfile, deleteUserid, UpdateVerifyAccount, /*verfyUserAccountCtrl*/}  = require ('../Controller/UserAuthC')
const validateObjectId = require('../middlewares/verfifyObjectId')
const { verfyToken } = require('../middlewares/verifyToekn')
const photoUplaod = require('../middlewares/photoAploade');
const { getAllUsers, updateAllprofile, getuserbyname } = require('../Controller/UserC')

//get count Users
router.get('/count',getCountUser)
// api/auth/register
router.get('/user/:id',validateObjectId,getuserbyId)
// get user by name
router.post('/username',getuserbyname)
// api/auth/register
router.post('/register',registerUserUrl)
// api/auth/Login
router.post('/Login',loginUser)
// api/auth/:userId/verify/:token
router.get('/:userId/verify/:token',/*verfyUserAccountCtrl*/)
//edit Image Profile
router.post('/img/:id',photoUplaod.single('image'),UpdateImageProfile)
//delete user by id
router.delete('/user/:id',deleteUserid)
// gete all users
router.get('/users',getAllUsers)
//update all user
router.put('/user/:id',updateAllprofile)
// verfy account
router.put('/user/verfyaccount/:id',UpdateVerifyAccount)

module.exports = router