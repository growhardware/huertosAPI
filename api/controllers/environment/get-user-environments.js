module.exports = {
  friendlyName: "Get the user's environments",

  description: "Get environments managed by the user logged in",

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
    const envIds = user["managing"].map((d) => d.id);
    let environments = await Environment.find({ id: envIds }).populate(
      "history"
    );

    if (this.req.isSocket) {
      const ids = environments.map((d) => d.id);
      Environment.subscribe(this.req, ids);
    }

    return environments;
  },
};
