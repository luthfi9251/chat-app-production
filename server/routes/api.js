const passport = require('passport')
const { v4: uuid4 } = require('uuid')
const User = require('../models/user')
const Conversation = require('../models/conversation')
const appendUserDetails = require('../database/appendUserDetail')
const getAllUserAddFriend = require('../database/getAllUserAddFriend')
const getAllPendingUser = require('../database/getAllPendingUser')
const getConversationId = require('../database/getConversationId')
const getAllFriends = require('../database/getAllFriends')
const os = require("os")
const express = require('express')
const multer = require('multer')
const storage = multer.diskStorage({})
const upload = multer({ storage: storage })
const router = express.Router()
const { cloudinary } = require("../config/cloudinary")

router.get('/getuser',(req,res)=>{
    let id = req.user._id

    getAllUserAddFriend(id,req.query.search)
        .then(result => {
            res.json({
                success: true,
                message: "success get data",
                data: result
            })
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                message: "failed get data",
                error: err
            })
        })

})

router.get('/getprofile',(req,res)=>{
    User.findById(req.user._id, (err,result)=>{
        if(!result){
            res.json({
                success: true,
                message: "Get user data",
                data: req.user
            })
            return
        }
        res.json({
            success: true,
            message: "Get user data",
            data: result
        })
    })
})

router.post('/addfriend',(req,res)=>{
    let body = req.body

    User.updateMany({ _id: { $in: body.member } }, { $push: {friends : body } } , (err,result)=>{
        if(err){
            console.log(err)
            return res.status(404)
        }
        if(result){
            // console.log(result)
            User.findById(req.user._id, (err,result)=>{
                res.json({
                    success: true,
                    message: "add friend",
                    data: result
                })
            })
        }
    })
})

router.get("/getpendingfriends",(req,res)=>{
    let id = req.user._id

    getAllPendingUser(id,req.query.search)
        .then(result => {
            return res.json({
                success: true,
                message: "Success get pending user",
                data: result
            })
        })
        .catch(err => {
            return res.status(400).json({
                success: false,
                message: "failed get pending user",
                err: err
            })
        })
    
})

router.post("/pendinguser",(req,res)=>{
    let list = req.body.member
    let action = req.query.action
    let convData = {
        roomId: uuid4(),
        member: list
    }
    // console.log(action)
    getConversationId(list)
        .then(coversationId => {
            let query = {friends:{$elemMatch:{_id:coversationId}}}
            User.find(query, "friends",(err,data) => {
                if(action === "rejected"){
                    data.forEach(item => {
                        item.friends.id(coversationId).remove()
                        item.save()
                    })
                    User.findById(req.user._id, (err,result)=>{
                        res.json({
                            success: true,
                            message: "add friend",
                            data: result
                        })
                    })
                }else{
                    Conversation.find({ member: { $all: list } })
                        .then(dataCon => {
                            if(dataCon){
                                Conversation.create(convData,(err,profile)=>{
                                    data.forEach(item => {
                                        item.friends.id(coversationId).accpeted = 1 //please ganti jadi accepted
                                        item.friends.id(coversationId).conversationId = profile._id
                                        // console.log(item.friends.id(coversationId))
                                        item.save()
                                    })
                                })
                            }
                        })
                        .then(() => {
                            User.findById(req.user._id, (err,result)=>{
                                res.json({
                                    success: true,
                                    message: "add friend",
                                    data: result
                                })
                            })
                        })

                }
            
            })
        })
})

router.get('/getallfriends',(req,res)=>{
    let id = req.user._id
    getAllFriends(id,req.query.search)
        .then(result => {
            return res.json({
                success: true,
                message: "Success get all friend",
                data: result || []
            })
        })
        .catch(err => {
            return res.status(400).json({
                success: false,
                message: "failed get all friend",
                err: err
            })
        })
})

router.post('/deletefriend',(req,res)=>{
    let id = req.user._id
    let member = req.body.member
    getConversationId(member)
        .then(conversationId => {
            let query = {friends:{$elemMatch:{_id:conversationId}}}
            User.find(query, "friends",(err,data) => {
                let friendData = data[0].friends.filter(item => item._id.toString() === conversationId)
                Conversation.deleteOne({ _id: friendData.conversationId})
                    .then(hapus => {
                        // console.log(data)
                        // console.log(friendData.conversationId)
                        // console.log(hapus)
                        data.forEach(itemD => {
                            itemD.friends.id(conversationId).remove()
                            itemD.save()
                        })
                    })
                    .then(()=>{
                        User.findById(id, (err,result)=>{
                            // console.log(id)
                            res.json({
                                success: true,
                                message: "delete friend",
                                data: result
                            })
                        })
                    })
            
            })
        })
})

router.post("/updateprofile",upload.single('image'), async (req,res) => {
    // console.log(req.user)
    let profilePicture = req.user.profilePicture

    if(req.file){
        let resCloudinary = await cloudinary.uploader.upload(req.file.path,{ folder: "profilepicture/", width: 720, height: 720, crop: "fill" })
        profilePicture = resCloudinary.url
    }
    User.findByIdAndUpdate(req.user._id,{ 
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        profilePicture
    })
        .then(result => {
            console.log("success update")
            console.log(res)
            res.status(200).json({
                success: true,
                msg: "success update profile"
            })
        })
        .catch(err => {
            console.log(err)
             res.status(400).json({
                success: false,
                msg: "failed update profile"
            })
        })

    
})




module.exports = router