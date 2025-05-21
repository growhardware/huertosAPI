module.exports = {
  friendlyName: "Get the user's devices",

  description: "Get devices managed by the user logged in",

  // inputs: {
  //   userId: {
  //     description: "The ID of the user to look up.",
  //     // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
  //     // if the `userId` parameter is not a number.
  //     type: "string",
  //     // By making the `userId` parameter required, Sails will automatically respond with
  //     // `res.badRequest` if it's left out.
  //     required: true,
  //   },
  // },

  // exits: {
  //   success: {
  //     responseType: "view",
  //     viewTemplatePath: "pages/welcome",
  //   },
  //   notFound: {
  //     description: "No user with the specified ID was found in the database.",
  //     responseType: "notFound",
  //   },
  // },

  // fn: async function ({ userId }) {
  //   // Look up the user whose ID was specified in the request.
  //   // Note that we don't have to validate that `userId` is a number;
  //   // the machine runner does this for us and returns `badRequest`
  //   // if validation fails.
  //   var user = await User.findOne({ id: userId });

  //   // If no user was found, respond "notFound" (like calling `res.notFound()`)
  //   if (!user) {
  //     throw "notFound";
  //   }

  //   // Display a personalized welcome view.
  //   return {
  //     name: user.name,
  //   };
  // },'

  fn: async function () {
    // console.log("req", this.req.session.userId);
    const userId = this.req.session.userId;
    const user = await User.findOne({ id: userId }).populate("managing");
    const devIds = user["managing"].map((d) => d.id);
    let devices = await Device.find({ id: devIds }).populate("history");
    // let selected = this.req.body.devices;
    // if (Array.isArray(selected)) {
    //   devices = devices.filter((dev) => selected.includes(dev.alias));
    // }
    console.log(devices);
    if (this.req.isSocket) {
      const ids = devices.map((d) => d.id);
      Device.subscribe(this.req, ids);
    }

    return devices;
    // return res.json(devices);
  },
};
