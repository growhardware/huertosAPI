module.exports = {
  friendlyName: "Get the user's farms",

  description: "Get farms managed by the user logged in",

  fn: async function () {
    try {
      const userId = this.req.session.userId;
      // Query the Farm model to find all posts created by the specified user
      const farms = await Farm.find({
        user: userId,
      });
      // Return the farms
      return farms;
    } catch (err) {
      return err;
    }
  },
};
