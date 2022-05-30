var express = require('express');
var router = express.Router();
var userModel=require('../modules/user')
var passModel=require('../modules/addpassword')
var bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken');
var passCatModel=require('../modules/password_category')

const { body, validationResult } = require('express-validator');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');

  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect("/");
  }
  next()
}


function checkUserName(req,res,next){
  var username=req.body.uname;
  var checkexistusername=userModel.findOne({username:username})
  checkexistusername.exec((err,data)=>{
  if(err) throw err
  if(data){
   return  res.render('signup', { title: 'Password Management System',msg:"Username already exist" });
  }
  next();
  })};

function checkEmail(req,res,next){
var email=req.body.email;
var checkexistemail=userModel.findOne({email:email})
checkexistemail.exec((err,data)=>{
if(err) throw err
if(data){
 return  res.render('signup', { title: 'Password Management System',msg:"Email already exist" });
}
next();
})};

// router.get('/view-all-password', checkLoginUser,function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
//   var perPage = 1;
//   var page = 1;
//   passModel.find({})
//              .skip((perPage * page) - perPage)
//              .limit(perPage).exec((err,data)=>{
//     if(err) throw err
//     passModel.countDocuments({}).exec((err,count)=>{
//     res.render('view-all-password', { title: 'Password Management System',loginUser:loginUser,records: data,
//     current: page,
//     pages: Math.ceil(count / perPage)  });
//     });
  
  
//   })
// });

// router.get('/view-all-password/:page', checkLoginUser,function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
//   var perPage = 1;
//   var page = req.params.page || 1;
//   passModel.find({})
//              .skip((perPage * page) - perPage)
//              .limit(perPage).exec((err,data)=>{
//     if(err) throw err
//     passModel.countDocuments({}).exec((err,count)=>{
//     res.render('view-all-password', { title: 'Password Management System',loginUser:loginUser,records: data,
//     current: page,
//     pages: Math.ceil(count / perPage)  });
//     });
  
  
//   })
// })

router.get('/', checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    
    var options = {
      
      offset:   1, 
      limit:    3
      };



      passModel.aggregate( [
        {
          $lookup:
            {
              from: "password_categories",
              localField: "password_category",
              foreignField: "password_category",
              as: "pass_cat_details"
            }
       },{$unwind:"pass_cat_details"}

     ] ).exec(function(err,results){
         if(err)
         throw err
        console.log(results)
        res.send(results)
     })
  });


  router.get('/:page', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var perPage = 1;
  var page = req.params.page || 1;
  passModel.find({})
             .skip((perPage * page) - perPage)
             .limit(perPage).exec((err,data)=>{
    if(err) throw err
    passModel.countDocuments({}).exec((err,count)=>{
    res.render('view-all-password', { title: 'Password Management System',loginUser:loginUser,records: data,
    current: page,
    pages: Math.ceil(count / perPage)  });
    });
  
  
  })
})

router.get('/password-detail/delete/:id', checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var delete_id=req.params.id;
    
    passModel.findByIdAndDelete(delete_id).exec((err)=>{
      if(err) throw err;
      else{
     
        res.redirect('/view-all-password');
      }
    })
  
  });











module.exports=router;