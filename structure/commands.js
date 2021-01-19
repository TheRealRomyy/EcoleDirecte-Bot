// Create class Command
class Command {

    // Create a constructor about command settings
	constructor(client, {
        // Name of the command
        name = null,
        // Aliases
        aliases = new Array(),
        // If the command is enabled or no
        enabled = true,
        // Permissions requires
        userPerms = new Array(),
        // PermLevel require (default: bot owner)
	permLevel = 6,
    }){
		this.client = client;
		this.settings = { enabled, userPerms, permLevel};
		this.help = { name, aliases };
	}
};

module.exports = Command; // Export class command
