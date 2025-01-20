module.exports = {
  friendlyName: "Get the user's batchs",

  description: "Get batchs managed by the user logged in",

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

  fn: async function () {
    // console.log("req", this.req.session.userId);
    const userId = this.req.session.userId;
    const user = await User.findOne({ id: userId }).populate("managing");
    const batchIds = user["managing"].map((d) => d.id);
    let batchs = await Batch.find({ id: batchIds }).populate("history");

    if (this.req.isSocket) {
      const ids = batchs.map((d) => d.id);
      Batch.subscribe(this.req, ids);
    }

    return batchs;
  },
};
