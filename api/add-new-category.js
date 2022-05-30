var express=require('express');
const mongoose=require('mongoose');
var router=express.Router();
var passCatModel=require('../modules/password_category')
var addpassword=require("../modules/addpassword")

router.get("/getCategory",function(req,res,next){
   
    passCatModel.find({},{"password_category":1,"_id":1}).exec().then(data=>{
        res.status(200).json({
            message:"Success",
            results:data

        })
    }).catch(err=>{
        res.json(err.errmsg)
    })
})




router.post("/post-category",function(req,res,next){
    var password_category=req.body.pass_cat;
   
    var passCatEntry=new passCatModel({password_category:password_category});
    
    passCatEntry.save().then(data=>{
 
        res.status(201).json({
            message:"Added Successfully",
            results:data
        })
    }).catch(err=>{
        res.json(err);
    })

  

})



// router.put("/add-update-category/:id",function(req,res,next){
// var id=req.params.id;
// var pass_cat=req.body.password_category;


// passCatModel.findById(id,function(err,data){
//     if (err) throw err
//     data.password_category=pass_cat?pass_cat:data.password_category;
    
//     // data.save(function(err,data){
//     //     if(err) throw err
//     //     // res.send("Data updated Successfully in Put ")
//     //     res.status(201).json({
//     //         message:"Data Updated Successfully",
//     //         results:data
//     //     })

//     // })

//     data.save()
//     .then(doc=>{
//         res.status(201).json({
//             message:"Updated Successfully",
//             results:doc

//         })
//     }
//     ).catch(err=>{
        
//         res.send(err.errmsg);
        
       
//     }
//     )

   
// })

    

// })

router.put("/add-update-category/:id",function(req,res,next){
var id=req.params.id;
var pass_cat=req.body.pass_cat;

passCatModel.findById(id,function(err,data){
    data.password_category=pass_cat?pass_cat:data.password_category;
    data.save().
    then(doc=>{
        res.status(200).json({
            message:"Updated Successfully",
        results:doc
        });
    }).
    catch(err=>{
        res.json(err.errmsg)
    }
        
    )




})


})








router.patch("/update-category/:id",function(req,res,data){
    var id=req.params.id;
    var pass_cat=req.body.password_category;
    
    
    passCatModel.findById(id,function(err,data){
        if (err) throw err
        data.password_category=pass_cat?pass_cat:data.password_category;
        // data.save(function(err,data){
        //     if(err) throw err
        //     res.send("Data updated Successfully in Put ")
    
        // })
        data.save()
    .then(doc=>{
        res.status(201).json({
            message:"Updated Successfully",
            results:doc

        })
    }
    ).catch(err=>{
        
        res.send(err.errmsg);
        
       
    }
    )
    
       
    })
})

router.delete("/deletecategory/:id",function(req,res,next){
    var id=req.params.id;
   passCatModel.findByIdAndDelete(id).then(doc=>{
    res.status(201).json({
        message:" Successfully",
        results:doc

    })}).catch(err=>{
        
        res.send(err);
        
       
    })

})

//////////////////////////////Add Password/////////////////////////////////////////
router.get("/allpassword",function(req,res,next){
    addpassword.find().select("_id password_category project_name password_details").populate("password_category").exec().then(data=>{
     
        res.status(200 ).json({
            message:"Success",
            results:data

        }
            
        )}).catch(err=>{
        
            res.send(err)
        })


})

router.post("/addpassword",function(req,res,next){
    var password_category=req.body.pass_cat;
    var project_name=req.body.pro_name;
    var password_details=req.body.pass_details;

    var addpassObject=new addpassword({
        
        password_category:password_category,
        project_name:project_name,
        password_details:password_details

    });
    
 
  
    addpassObject.save().then(
        doc=>{
            
            res.status(201).json({
                            message:"Password added Successfully",
                             results:doc
                         });}
        ).catch(
        err=>{
            res.json(err);
            }

    )
})

router.delete("/deletepassword",function(req,res,next){
    var id=req.body.id;
    addpassword.findByIdAndDelete(id).then(doc=>{
    res.status(201).json({
        message:" Deleted Successfully",
        results:doc
    })}).catch(err=>{
        
        res.send(err);
        
       
    })


});

module.exports=router;