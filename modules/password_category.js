const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/pms")
var conn=mongoose.connection;

var passcatSchema=new mongoose.Schema({
    password_category:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },

   
    date:{
        type:Date,
        default:Date.now
    }

});

var passCatModel=mongoose.model("password_categories",passcatSchema);

module.exports=passCatModel;