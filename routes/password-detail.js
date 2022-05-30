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

router.get('/', checkLoginUser,function(req, res, next) {
    res.redirect("/dashboard")
    passModel.find({}).exec()
   });
   
   
router.get('/edit/:id', checkLoginUser,function(req, res, next) {
   var id=req.params.id;
   var loginUser=localStorage.getItem('loginUser');
   
   console.log("Hello world")
   passCatModel.find({}).exec((err,data)=>{
     if (err) throw err;
   passModel.findById({_id:id}).exec((err,data1)=>{
       if(err) throw err
       
       res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data,record:data1,success:"" });
     })
    });
   });
   
   router.post('/edit/:id', checkLoginUser,function(req, res, next) {
     var id=req.params.id;
     var loginUser=localStorage.getItem('loginUser');
     var passcat=req.body.pass_cat;
     var pass_details=req.body.pass_details;
     var project_name=req.body.project_name;
     
     passModel.findByIdAndUpdate(id,{
       password_category:passcat,
       project_name:project_name,
       password_details:pass_details
     }).exec((err,data)=>{
       if(err)throw err
   
     
   
   
     
     
     passCatModel.find({}).exec((err,data)=>{
       if (err) throw err;
     passModel.findById({_id:id}).exec((err,data1)=>{
         if(err) throw err
         
         res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data,record:data1,success:"Updated Successfully" });
       });
      });
     });
   });
   



   module.exports=router