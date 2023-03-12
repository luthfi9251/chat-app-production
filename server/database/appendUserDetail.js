const User = require('../models/user.js')

module.exports = async function (res,id,friendId){
    return new Promise((resolve, reject) => {
        User.findById(id, "friends", (err, result) => {
        if(err) reject(new Error(err))
        if(result){
            res.forEach(item => {
                let index = result.friends.findIndex(i => {
                    return i.member.includes(item._id)
                })
                if(index !== -1){
                    let data = {
                        username: item.username,
                        name: item.name,
                        profilePicture: item.profilePicture,
                        isSelf: result.friends.requestBy === id
                    }
                    resolve(data)
                }
            })
        }
        

    })})
    // let ids = []
    // arrayDoc.forEach(item=>{
    //     let x = item.member.filter(i => i !== id)
    //     ids.push(x)
    // })

    // let result = await User.find({ _id : { $in : ids } })
    // arrayDoc.forEach(item => {
    //     item.member.forEach(uid => {
    //         let index = result.findIndex(i => i._id.toString() === uid)
    //         if(index !== -1){
    //             item.username = result[index].username
    //             item.name = result[index].name
    //             item.profilePicture = result[index].profilePicture
    //         }
    //     })
    // })
    // return arrayDoc
}