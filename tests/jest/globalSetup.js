require("babel-register");
require("@babel/polyfill/noConflict");
const server = require("../../src/server").default;

module.exports = async () => {
  const opts = {
    port: process.env.PORT || 4000
  };
  global.httpServer = await server.start(opts, ({ port }) => {
    console.log(`Jest Test Server running on port:${port}\n`);
  });
};
