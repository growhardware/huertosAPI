module.exports = {
  friendlyName: "Get the user's batchs",

  description: "Get batchs managed by the user logged in",

  fn: async function () {
    try {
      const userId = this.req.session.userId;
      // Query the Batch model to find all posts created by the specified user
      const batchs = await Batch.find({
        user: userId,
      });
      // Return the batchs
      return batchs;
    } catch (err) {
      return err;
    }
  },
};
