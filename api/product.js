var express=require("express");
const productModel = require("../modules/products");
var router=express.Router();
const mongoose=require('mongoose');
var checkauth=require('./middleware/auth')

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {

      cb(null, Date.now()+file.originalname);
    },
    fileFilter:fileFilter
  })

  function fileFilter(req,res,cb){
      if(mimetype==="image/png" || mimetype==="image/jpg" || mimetype==="image/pdf"){
          cb(null,true);
      }
      else{
          cb(null,false);
      }

  }

const upload = multer({ 
    storage: storage,
    limits:{
        fileSize:1024*1024*5
    }

});







  




router.get("/",function(req,res,next){
    res.status(200).json({
        message:"Success"
    });

})

router.get("/getAllProducts",function(req,res,next){
productModel.find().
select("product_name price quantity image").
exec().then(
    data=>{
        res.status(200).json({
            message:"Successfull",
            result:data
        })
    }
).catch(err=>{

    res.json(err);
})

});

router.post("/add",checkauth,upload.single('productImage'),function(req,res,next){

console.log(req.file)

    var product_name=req.body.pname;
    var price=req.body.price;
    var quantity=req.body.qty;

   
var productdetails=new productModel({
        product_name:product_name,
        price:price,
        quantity:quantity,
        image:req.file.path
});





productdetails.save().then(
    docs=>{
        res.status(201).json({
            message:"Success",
        result:docs
        })
        
    }
).catch(err=>{
    res.json(err);
})



});

module.exports=router;