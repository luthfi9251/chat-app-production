const User = require('../models/user')

module.exports = function(list){
    let query = {
        friends: {
            $elemMatch: {
                member: {
                    $all: list
                }
            }
        }
    }
    // console.log(list)
    return new Promise((resolve,reject) => {
        User.findOne(query,"friends", (err,result) => {
            if(err) reject(err)
            result = result.friends.filter(item =>{
                if(item.member.length > 1){
                    if(item.member.every(x => x === list[0] || x === list[1])){
                        return true
                    }
                }
                return false
            })
            // console.log(result)
            
            resolve(result[0]._id)
        })

    })
}