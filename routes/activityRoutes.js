const express =
require("express");

const router =
express.Router();

const Activity =
require("../models/Activity");

router.get(
  "/user/:userId",
  async(req,res)=>{

    try{

      const activities =
      await Activity.find({

        userId:
        req.params.userId

      })
      .sort({
        createdAt:-1
      })
      .limit(10);

      res.json({

        success:true,

        activities

      });

    }
    catch(error){

      res.status(500).json({
        success:false,
        message:error.message
      });

    }

});

module.exports =
router;