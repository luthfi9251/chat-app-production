const passport = require('passport')
const express = require('express')
const router = express.Router()

router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }))

router.get('/redirect/google',passport.authenticate('google', {
    successRedirect: process.env.ENVIRONMENT === "PRODUCTION" ? "/chat" : "http://localhost:5173/chat",
    failureRedirect: '/auth/redirect/failed' //please fix this later
}));

router.get('/failure',(req,res)=>{
    res.status(401).json({
        success: false,
        message: "Fail when attemting to login"
    })
})



module.exports = router