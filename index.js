const dotenv = require('dotenv')
dotenv.config()
const express =require('express')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiting = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const path = require('path')

//App______Use
const app = express()
app.use(express.json())
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "blob:", "*"], // Correct use of blob scheme
            workerSrc: ["'self'", "blob:"], // Allow workers from blob URLs
            imgSrc: ["'self'","*","","https://img.favpng.com","https://media.istockphoto.com","https://img.favpng.com", "https://res.cloudinary.com", "data:", "blob:"], // Allow external image sources
            // Add other directives as needed
        },
    },
}));

app.use(xss())
app.use(hpp())
app.use(rateLimiting({
    windowMs: 10 * 60 * 1000, // 10min
    max : 200// ارسال  البيانات 200 مرة فقط في كل 10 دقائق
}))
//MONGO DB _h___
const mongo = require('./db/DATAbase')
mongo()
//cors
app.use(cors())
const morgan  = require('morgan')
app.use(morgan('dev'))

// Router 
app.use('/api/auth',require('./router/auth.js'))
app.use('/api/auth',require('./router/Post.js'))
app.use('/api/auth',require('./router/serveice.js'))

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});


//PORT
PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log('hello world '+PORT);
})
