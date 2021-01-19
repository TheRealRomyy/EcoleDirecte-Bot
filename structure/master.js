// Import modules
const { Client, Collection } = require("discord.js");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);

// Create class Master who extends of the Discord Client
class Master extends Client {

    constructor(option) {
        super(option);

        this.cfg = require("../config.json"); // Configuration
        this.emotes = require("../emojis.json"); // Custom emojis
        this.logger = require("../helpers/logger.js"); // A logger
        this.permLevel = require("../helpers/permissions.js"); // A file to check perm level
        this.translate = require("../helpers/language.js"); // Translate a path into french
        this.ecoledirecte = require("../users"); // Get users file (who click to save account)

        this.cmds = new Collection(); // Command collection
        this.aliases = new Collection(); // Aliases collection        
    };

    // Create the init function
    async init() {

        // Log a separator
        await this.logger.log("separator");

        // Load all commands
        const cmdFile = await readdir("./commands/");
        cmdFile.forEach(async (dir) => {
            const commands = await readdir("./commands/" + dir + "/");
            commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
                this.loadCommand("./commands/" + dir, cmd);
            });
        });

        // Load all events
        const evtFile = await readdir("./events/");
        evtFile.forEach((file) => {
            const eventName = file.split(".")[0];
            const event = new (require(`../events/${file}`))(this);
            this.logger.log("event", eventName)
            this.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(`../events/${file}`)];
        }); 

        // Log a separator
        await this.logger.log("separator");

        // Login with discord
        this.login(this.cfg.token);
    };

    // Create the loadCommand function (from Androz)
    async loadCommand(commandPath, commandName) {
		try {
			const props = new(require(`.${commandPath}/${commandName}`))(this);
			this.logger.log("command", commandName)
			this.cmds.set(props.help.name, props);
			props.help.aliases.forEach((alias) => {
				this.aliases.set(alias, props.help.name);
			});
		} catch (error) {
			return console.log((chalk.red`Command: '${chalk.bold(commandName)}' can't be load: ${error}`));
		};
    };

    // Create a function to get perm level
    async getPermLevel(message) {
        return this.permLevel.check(message.guild, message.author.id, this.cfg);
    };

    // Save a json file
    async saveJsonFile(path, file) {
        await fs.writeFile(path, JSON.stringify(file, null, 4), (error) => {
            if(error) this.logger.log("error", err)
        });
    };
};

module.exports = Master; // Export the module