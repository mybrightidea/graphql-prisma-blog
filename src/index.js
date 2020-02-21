import "@babel/polyfill/noConflict";
import server from "./server";

const opts = {
  port: process.env.PORT || 4000
};

server.start(opts, ({ port }) => {
  console.log(`Server running on port:${port}\n`);
});
