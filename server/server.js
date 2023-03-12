const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {createServer} = require('http')
const cookieSession = require('cookie-session')
const path = require('path')
const passport = require('passport')
const cors = require('cors')
const User = require('./models/user')
const Conversation = require('./models/conversation')
// const {socketServer} = require('./socket/socket')
var session = require('express-session')

require('dotenv').config()
require('./config/passport-config')
const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')
const chatapiRoutes = require('./routes/chatapi')
const cookieSessionFix = require('./config/cookie-session')
const authenticate = require('./middleware/authenticate.js')

// const httpServer = createServer(app)
// socketServer(httpServer)

const PORT = process.env.PORT || 8080
const URI = process.env.MONGO_URI

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected!!"))
    .catch((err) => console.log(`Database not connected : ${err}`));

app.set('trust proxy', 1)

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(
    session({
      secret: "this_is_a_secret",
      resave: false,
      saveUnitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false,
        sameSite: false 
      }
    })
  );
// app.use(cookieSession({ 
//     name: "session", 
//     keys: ["luthfi"], 
//     maxAge: 60 * 60 * 1000,
//     sameSite: 'none',
//     secure: false,
//     httpOnly: true
// }))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))
app.use(cookieSessionFix)


app.use('/auth',authRoutes)
app.use('/api',authenticate,apiRoutes)
app.use('/chatapi',authenticate,chatapiRoutes)


// app.get("/",(req,res)=>{
//     console.log(req.headers.cookie)
//     res.send("hello world")
// })

app.get('/deletealluser',(req,res) => {
    User.deleteMany({},(er,result) => {
        Conversation.deleteMany({}, (err,result) => {
            res.send("deleted")
        })
    })
})

// httpServer.listen(PORT,()=>{
//     console.log("Listening on port: " + PORT)
// })

if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname, '../client', 'dist')));
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
    })
}


app.listen(PORT, ()=> {
    console.log("Listening on port: " + PORT)
})

module.exports = app