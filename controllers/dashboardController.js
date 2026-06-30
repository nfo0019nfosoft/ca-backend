const Notification =
  require("../models/Notification");

const Vendor =
  require("../models/Vendor");

exports.getRecentActivities =
async (req,res)=>{

  try{

    const activities =
      await Notification.find({
        userId:
          req.params.userId
      })
      .sort({
        createdAt:-1
      })
      .limit(5);

    res.status(200).json({

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

};

exports.getRecommendations =
async(req,res)=>{

  try{

    const vendors =
      await Vendor.find()
      .select("services");

    let recommendations = [];

    vendors.forEach(vendor=>{

      vendor.services.forEach(service=>{

        recommendations.push({

          _id:
            service._id,

          name:
            service.serviceName,

          description:
            service.description ||
            "Professional CA Service",

          price:
            service.price || 0,

          slug:
            service.serviceName
              .toLowerCase()
              .replace(/\s+/g,"-")

        });

      });

    });

    res.status(200).json({

      success:true,

      recommendations:
        recommendations.slice(0,8)

    });

  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};