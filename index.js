const server = require("./data/server.js");

const port = process.env.PORT || 8500;

server.listen(port, () => {
  console.log(`\n** SERVER RUNNING ON PORT ${port} **\n`);
});
