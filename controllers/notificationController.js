const Notification =
require("../models/Notification");

exports.getUserNotifications =
async(req,res)=>{

  try{

    const notifications =
    await Notification
    .find({
      userId:req.params.userId
    })
    .sort({
      createdAt:-1
    })
    .limit(10);

    res.status(200)
    .json(
      notifications
    );

  }
  catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};