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
    res.render('dashboard', { title: 'Password Management System',msg:"",loginUser:loginUser });
  });


module.exports = router;