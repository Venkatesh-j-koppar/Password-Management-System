var jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    var token=req.body.token
    console.log(token)
    next();
}