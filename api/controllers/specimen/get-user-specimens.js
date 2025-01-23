module.exports = {
  friendlyName: "Get the user's specimens",

  description: "Get specimens managed by the user logged in",

  fn: async function () {
    try {
      const userId = this.req.session.userId;
      // Query the Specimen model to find all posts created by the specified user
      const specimens = await Specimen.find({
        user: userId,
      });
      // Return the specimens
      return specimens;
    } catch (err) {
      return err;
    }
  },
};
