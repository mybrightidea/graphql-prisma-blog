const constants = {};
constants.secret = process.env.TOKEN_SECRET;
constants.expiresIn = "7 days";
module.exports = constants;
