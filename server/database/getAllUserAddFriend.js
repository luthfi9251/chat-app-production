const User = require('../models/user')
const getAllFriendsId = require('./getAllFriendsId')

module.exports = async function (id, query){
    let friendId = await getAllFriendsId(id)
    friendId.push(id)
    let regex = new RegExp(query)
    query = query ? { username : regex, _id : { $nin : friendId }} : { _id : { $nin : friendId } }

    let getAllUser = new Promise((resolve,reject) => {
        User.find(query, (err,res) => {
            if (err) reject(new Error(err))
            if(res){
                resolve(res)
            }
        })
    })

    return getAllUser
}