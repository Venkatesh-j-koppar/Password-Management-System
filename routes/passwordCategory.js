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
    var loginUser=localStorage.getItem('loginUser');
     passCatModel.find({}).exec((err,records)=>{
      if(err) throw err;
      else{
     
        res.render('password_category', { title: 'Password Management System',loginUser:loginUser,records:records });
      }
    })});
  
    router.get('/edit/:_id', checkLoginUser,function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser');
       var id=req.params._id
       passCatModel.findById(id).exec((err,records)=>{
        if(err) throw err;
        else{
       
          res.render('edit_pass_category', { title: 'Password Management System',loginUser:loginUser,errors:"",success:
          "",records:records,id:id});
        }
      })});
  
      router.post('/edit/', checkLoginUser,function(req, res, next) {
        var loginUser=localStorage.getItem('loginUser');
         var id=req.body.id;
         var pas=req.body.passwordCategory;
         passCatModel.findByIdAndUpdate(id,{
          password_category:pas
         }).exec((err,records)=>{
          if(err) throw err;
          else{
         
           res.redirect("/passwordCategory");
          }
        })});
  
  
      router.get('/delete/:id', checkLoginUser,function(req, res, next) {
        var loginUser=localStorage.getItem('loginUser');
        var delete_id=req.params.id;
        
        passCatModel.findByIdAndDelete(delete_id).exec((err)=>{
          if(err) throw err;
          else{
         
            res.redirect('/passwordCategory');
          }
        })
      
      });  


module.exports=router;