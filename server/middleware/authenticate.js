module.exports = function(req, res, next){
    console.log("ini req user")
    console.log(req.session)
    if(!req.user){
        res.status(401).json({
            success: false,
            message: "Please Login first"
        })
        return
    }
    next()
}