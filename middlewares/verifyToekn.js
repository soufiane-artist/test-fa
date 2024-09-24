const jwt = require ('jsonwebtoken')



function verfyToken(req,res,next){
    // البحث في مكان التوكن
    const authRoken = req.headers.authorization;
    if(authRoken) {
        //احضار التوكن والتفرقة بينbearer و النوكن بالفاصلة 
        const token = authRoken.split(" ")[1];
        try{
            //التحقق هل يوجد توكن
            const decodedPayoad = jwt.verify(token,process.env.JWT_Scrite);
            req.user = decodedPayoad;
            next()
        } catch (error) {
            return res.status(401).json({message : "invalid token, access denide"})
        }
    } else {
            return res.status(401).json({ message : 'no token provided, access denied'})
    }
}
// verify token and admin
function  verifyTokenAdmin(req,res,next){
    verfyToken(req,res, () => {
        if(req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({message : "not allowed , only admin"})
        }
    })
}
// verify token and only himself User
function  verifyTokenonUser(req,res,next){
    verfyToken(req,res, () => {
        // التحقق هل ان المستخدم له نفس التوكن 
        if(req.user.id === req.params.id) {
            console.log(req.user.id);
            next();
        } else {
            return res.status(403).json({message : "not allowed , only user himself"})
        }
    })
}

function verfyTokenAdmin(req,res,next){
    verfyToken(req,res, () => {
        //التحقق من ان التوكن خاص بالادمين
        if(req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ Error : " Delete User only of admin "})
        }
    })
}
// verify token and only himself User
function  verifyTokenonUserOrAdmin(req,res,next){
    verfyToken(req,res, () => {
        //التحقق من ان التوكن خاص بالادمين او بالمستخدم المسجل فقط
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({message : "not allowed , only user himself or admin"})
        }
    })
}


module.exports = {
    verfyToken,
    verifyTokenAdmin,
    verifyTokenonUser,
    verfyTokenAdmin,
    verifyTokenonUserOrAdmin
}