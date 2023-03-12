const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Conversation = require('../models/conversation')

router.get('/',(req, res) => {
    //we need name, profilepict, room id, conversation id
    User.findById(req.user._id)
        .then(data => {
            let friends = data.friends.map(item => {
                if(item.accpeted === 1){
                    return {
                        conversationId : item.conversationId,
                        requestBy : item.requestBy,
                        member : item.member
                    }
                }
            })
            friends = friends.filter(x => x !== undefined)
            // console.log(friends)
            return friends
        })
        .then(friend => {
            let arr = friend.map(item => {
                let bool = item.member[0] === req.user._id ? item.member[1] : item.member[0]
                return User.findById(bool)
                    .then(result => {
                        // console.log(result)
                        return {
                            ...item,
                            profilePicture: result.profilePicture,
                            name: result.name
                        }
                    })
            })
            // console.log(arr)
            Promise.all(arr).then(data => {
                res.send(data)
            })
            
        })
        .catch(err => {
            res.status(401).send(err)
        })
})

router.get('/chat',(req, res) => {
    let conversationId = req.query.conid
    Conversation.findById(conversationId)
        .then(result => {
            res.send(result.messages)
        })
})

router.post('/chat', (req, res) => {
    let conversationId = req.query.conid
    let body = {
        ...req.body
    }
    Conversation.findByIdAndUpdate(conversationId, { $push: {messages: body } },(err,result) => {
        // console.log(result)
        res.send(result)
    })

})


module.exports = router