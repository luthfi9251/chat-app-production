const User = require('../models/user')

module.exports = function (id,filter){
    // console.log(id)
    let getIdPromise = new Promise((resolve,reject) => {
        User.findById(id, "friends" , (err, result) => {
            let idFriend = []
            if(err) reject(new Error(err))
            if(result){
                if(result.friends.length > 0){
                    switch(filter){
                        case 'pending':
                            result.friends = result.friends.filter(x => x.accpeted === 0)
                            break
                        case 'friends':
                            result.friends = result.friends.filter(x => x.accpeted === 1)
                            break
                        default:
                            break
                    }
                    result.friends.forEach(item => {  //return dokumen friend
                        item.member.forEach(itemId => {
                            if(itemId !== id){
                                idFriend.push(itemId)
                            }
                        })
                    })
                }
            }


            resolve(idFriend)
        })
    })
    return getIdPromise
}

