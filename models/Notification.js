const mongoose = require("mongoose");

const notificationSchema =
new mongoose.Schema({
userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  default:null
},

vendorId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Vendor",
  default:null
},

  type:{
    type:String,
    enum:[
      "enquiry",
      "appointment",
      "payment",
      "response",
      "system"
    ]
  },

  title:{
    type:String,
    required:true
  },

  message:{
    type:String,
    required:true
  },

  relatedId:{
    type:mongoose.Schema.Types.ObjectId,
    default:null
  },

  isRead:{
    type:Boolean,
    default:false
  }

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "Notification",
  notificationSchema
);