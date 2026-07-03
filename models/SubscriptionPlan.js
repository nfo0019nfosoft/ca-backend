const mongoose = require("mongoose");

const subscriptionPlanSchema =
new mongoose.Schema(
{
  name:{
    type:String,
    required:true,
    unique:true
  },

  slug:{
    type:String,
    required:true,
    unique:true
  },

  level:{
    type:Number,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  billingCycle:{
    type:String,
    enum:[
      "Monthly",
      "Yearly"
    ],
    default:"Monthly"
  },

  description:{
    type:String,
    default:""
  },

  features:[
    {
      type:String
    }
  ],

  maxLeads:{
    type:Number,
    default:0
  },

  maxDocuments:{
    type:Number,
    default:0
  },

  maxTeamMembers:{
    type:Number,
    default:0
  },

  storage:{
    type:Number,
    default:0
  },

  priority:{
    type:Number,
    default:999
  },

  featuredListing:{
    type:Boolean,
    default:false
  },

  appointmentBooking:{
    type:Boolean,
    default:false
  },

  dashboardAnalytics:{
    type:Boolean,
    default:false
  },

  searchRanking:{
    type:String,
    default:"Normal"
  },

  supportLevel:{
    type:String,
    default:"Standard"
  },

  active:{
    type:Boolean,
    default:true
  }

},
{
  timestamps:true
}
);

module.exports =
mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);