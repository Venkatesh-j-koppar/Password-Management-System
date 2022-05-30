const { json } = require("express");
var express=require("express");
var router=express.Router();
const mongoose=require('mongoose');
const userModel=require('../modules/user');
const bcrypt = require('bcrypt');

router.post("/login",function(req,res,next){
    var username=req.body.username;
    var password=req.body.password;
    userModel.find({username:username}).exec().
    then(user=>{
        if(user.length<1)
        {
            res.status(404).json({
            message:"user NotExist",
          
        
        })

        }
        else{
            bcrypt.compare(password, user[0].password, function(err, result) {
                if(err){
                    res.status(404).json({
                        message:"Authentication Failed",
                      
                    
                    });

                if(result){
                    res.status(201).json({
                        message:"User found",
                        user:user
                    })

                }
                else{
                    res.status(404).json({
                        message:"Auth Failed"
                    })
                }

                }
            });
        res.status(201).json({
            message:"user Exist",
            user:user
        
        })
    }
    }).
    catch(err=>{
        res.json({error:err})
    })

});


router.post("/signup",function(req,res,next){

    var username=req.body.username;
    var email=req.body.email;
    var password=req.body.password;
    var confirmPassword=req.body.confirmpassword;

if(password!==confirmPassword){
    console.log(password);
    console.log(confirmPassword);
 res.json({
     message:"Password didnot match"
 })

}
else{
    bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in your password DB.
        if(err){
            return res.json({
                message:"Something went wrong",
                error:err

            });

        }
        else{
            var userModel1=new userModel({
                username:username,
                email:email,
                password:hash

                })
            
            
                userModel1.save().then(doc=>{
                    res.status(200).json({
                        message:"Success",
                        result:doc
                    })
                }).catch(err=>{
                    res.json(err);
                    })

        }
    });


    }

})

module.exports=router;

