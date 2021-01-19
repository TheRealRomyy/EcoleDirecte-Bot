// Import class master
const Master = require("./structure/master.js");

// Create a client
const client = new Master({
    partials: ["MESSAGE", "USER", "REACTION", "GUILD_MEMBER"]
});

// Load our function init
client.init();