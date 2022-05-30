const mongoose=require("mongoose");
var mongoosePaginate=require("mongoose-paginate");
mongoose.connect("mongodb://localhost:27017/pms");
var conn=mongoose.Collection;


var productSchema=new mongoose.Schema({

//image path
//limit
//type jpeg,jpg,png

product_name:{
    type:String,
    required:true,

},
price:{
    type:Number,
    required:true
},
quantity:{
    type:Number,
    required:true
},
image:{
    type:String,
    required:true
},
date:{
    type:Date,
    default:Date.now
}
});
productSchema.plugin(mongoosePaginate);
var productModel=mongoose.model('product',productSchema);
module.exports=productModel;

