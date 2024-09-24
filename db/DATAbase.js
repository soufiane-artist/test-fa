const mongoose = require('mongoose')


MONGO = ()=>{
    mongoose.connect(process.env.MONGO).then(()=>{
        console.log('DB connected')
    }).catch(()=>{
        console.log('error connect DataBase');
    })
}

module.exports = MONGO