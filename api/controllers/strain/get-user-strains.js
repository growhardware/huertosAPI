module.exports = {
  friendlyName: "Get the user's strains",

  description: "Get strains managed by the user logged in",

  fn: async function () {
    try {
      const userId = this.req.session.userId;
      // Query the Strain model to find all posts created by the specified user
      const strains = await Strain.find({
        user: userId,
      });
      // Return the strains
      return strains;
    } catch (err) {
      return err;
    }
  },
};
