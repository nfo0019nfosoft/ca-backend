const Activity =
require("../models/Activity");

exports.getActivities =
async(req,res)=>{

  try{

    const activities =
      await Activity.find({
        userId:
          req.params.userId
      })
      .sort({
        createdAt:-1
      });

    console.log(
      "Activities Found:",
      activities
    );

    res.status(200).json({
      success:true,
      activities
    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};