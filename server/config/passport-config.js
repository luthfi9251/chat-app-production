let GoogleStrategy = require('passport-google-oauth20').Strategy;
let passport = require('passport')
let User = require('../models/user')

let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
let GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

function createUsername(string){
    let temp = string.toLowerCase().split(" ").join("") + Math.floor(Math.random()*1000)
    return temp
}

function insertDatabase(object){
    User.create(obj, (err, data)=>{
        if(err) return console.log(err)
        console.log(data)
    })
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI //jangan lupa ganti redirect uri nya
  },
  function(accessToken, refreshToken, profile, done) {
    let dataProfile = {
        authType: "google",
        authId: profile.id,
        name: profile.displayName,
        username: createUsername(profile.displayName),
        email: profile.emails[0]?.value,
        profilePicture: profile.photos[0]?.value
    }
    //database action
    User.findOne({ authType: "google", authId: dataProfile.authId},(err, data)=>{
        if(err) return done(null,false)
        if(!data){
            User.create(dataProfile, (err, res)=>{
                if(err) return console.log(err)
                // console.log(res)
                done(null,res)
            })
            return
        }
        done(null,data)
    })
  }
));

passport.serializeUser((user,done)=>{
  done(null,user)
})

passport.deserializeUser((user,done)=>{
  console.log("ini deserialize user")
  console.log(user)
  done(null,user)
})