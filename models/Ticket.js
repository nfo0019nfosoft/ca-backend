const mongoose = require("mongoose");

const ticketSchema =
new mongoose.Schema({

  ticketId:{
    type:String,
    unique:true
  },

  raisedBy:{
    type:String,
    enum:[
      "user",
      "vendor"
    ],
    required:true
  },

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

  category:{
    type:String,
    required:true
  },

  subject:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  },

  priority:{
    type:String,
    enum:[
      "Low",
      "Medium",
      "High",
      "Urgent"
    ],
    default:"Medium"
  },

  attachment:{
    type:String,
    default:""
  },

  status:{
    type:String,
    enum:[
      "Open",
      "In Progress",
      "Resolved",
      "Closed"
    ],
    default:"Open"
  },

  messages:[
    {

      sender:{
        type:String,
        enum:[
          "user",
          "vendor",
          "admin"
        ],
        required:true
      },

      message:{
        type:String,
        required:true
      },

      createdAt:{
        type:Date,
        default:Date.now
      }

    }
  ]

},
{
  timestamps:true
});

module.exports =
mongoose.model(
  "Ticket",
  ticketSchema
);