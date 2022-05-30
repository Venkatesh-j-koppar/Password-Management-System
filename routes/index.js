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




/* GET home page. */
router.get('/', function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('/dashboard')
  } else {
    res.render('index', { title: 'Password Management System', msg: "" });
  }
});


router.post('/', function (req, res, next) {
  var username = req.body.uname;

  var password = req.body.password;

  var checkuser = userModel.findOne({ username: username })
  checkuser.exec((err, data) => {
    if (err) throw err
    var getUserID = data._id;

    var getpassword = data.password;


    if (bcrypt.compareSync(password, getpassword)) {
      var token = jwt.sign({ userId: getUserID }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', username);
      res.redirect('/dashboard');
    }
    else {
      res.render('index', { title: 'Password Management System', msg: "Invalid Password" });
    }

  })



});


router.get('/signup', function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('/dashboard')
  } else {
    res.render('signup', { title: 'Password Management System', msg: "" });
  }
});

router.post('/signup', checkUserName, checkEmail, function (req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;

  if (password != confpassword) {
    res.render('signup', { title: 'Password Management System', msg: "Password Mismatch!" });

  } else {
    password = bcrypt.hashSync(password, 10)
    var userDetails = new userModel({
      username: username,
      email: email,
      password: password
    })
    userDetails.save((err, data) => {
      if (err) throw err
      res.render('signup', { title: 'Password Management System', msg: "User Registered Successfully" });
    })

  }

});

router.get('/logout', function (req, res, next) {
  localStorage.removeItem('userToken')
  localStorage.removeItem('loginUser')
  res.redirect('/')
});


module.exports = router;
