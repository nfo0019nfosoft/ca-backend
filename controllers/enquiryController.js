await Notification.create({

  userId,

  type: "enquiry",

  title: "Enquiry Submitted",

  message:
    `Your enquiry for ${serviceName} has been submitted.`

});

await Activity.create({

  userId,

  type: "enquiry",

  title: "Enquiry Submitted",

  message:
    `You submitted an enquiry for ${serviceName}.`

});


console.log("VENDOR ID FOR NOTIFICATION =", vendorId);

const notification = await Notification.create({
  vendorId,
  type: "enquiry",
  title: "New Lead Received",
  message: `${fullName} submitted enquiry for ${serviceName}`
});

console.log("NOTIFICATION CREATED =", notification);


await Activity.create({
  vendorId,
  type:"lead",
  title:"New Lead",
  message:`New lead received from ${fullName} for ${serviceName}`
});