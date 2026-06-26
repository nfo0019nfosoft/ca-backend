const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
{
  vendorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    required:true
  },

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  serviceName:[String],

  fullName:String,
  email:String,
  mobile:String,

  companyName:String,

  source:{
    type:String,
    default:"Website"
  },

  region:{
    type:String,
    default:"India"
  },

  preferredContact:String,
  preferredTime:String,

  businessType:String,
  annualTurnover:String,
  businessStructure:String,
  panNumber:String,
budget:String,
timeline:String,
  requirements:String,


gstRequired: {
  type: String,
  default: ""
},

hearAboutUs: {
  type: String,
  default: ""
},
location: {
  type: String,
  default: ""
},


city: {
  type: String,
  default: ""
},

state: {
  type: String,
  default: ""
},

documents: [
  {
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }
],




notes: {
  type: String,
  default: ""
},




  status:{
    type:String,
    enum:[
      "new",
      "contacted",
      "qualified",
      "proposal_sent",
      "converted",
      "lost"
    ],
    default:"new"
  }

},
{
  timestamps:true
});

module.exports = mongoose.model(
  "Enquiry",
  enquirySchema
);