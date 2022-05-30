const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/pms")
var conn=mongoose.connection;
var mongoosePaginate = require('mongoose-paginate');


var passSchema=new mongoose.Schema({
    
    password_category:{
        
        type:mongoose.Schema.Types.ObjectId,
        ref:"password_categories",
        required:true,
      
    },
    project_name:{
        type:String,
        required:true,
       
    },
    password_details:{
        type:String,
        required:true,
       
    },

   
    date:{
        type:Date,
        default:Date.now
    }

});
passSchema.plugin(mongoosePaginate);
var passModel=mongoose.model("password_details",passSchema);

module.exports=passModel;