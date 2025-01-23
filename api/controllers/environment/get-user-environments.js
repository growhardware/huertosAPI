module.exports = {
  friendlyName: "Get the user's environments",

  description: "Get environments managed by the user logged in",

  fn: async function () {
    try {
      const userId = this.req.session.userId;
      // Query the Environment model to find all posts created by the specified user
      const environments = await Environment.find({
        user: userId,
      });
      // Return the environments
      return environments;
    } catch (err) {
      return err;
    }
  },
};
