module.exports = {
  friendlyName: "Get the user info",

  description: "Get the user info stored in backend session",

  fn: async function () {
    if (!this.req.session.userId) {
      return "Not authenticated";
    }
    return { userId: this.req.session.userId };
  },
};
