const chalk = require("chalk");

class Message {

	constructor (client) {
		this.client = client;
	};

	async run(message) {

        const client = this.client;

        if(message.author.bot || !message.guild || !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

        let prefix = client.cfg.prefix;

        if(message.content == `<@!${client.user.id}>`) return message.shield("misc:HELLO", {
            emoji: "info",
            username: message.author.username,
            prefix
        });

        if(!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const commandName = args.shift().toLowerCase();
		const cmd = client.cmds.get(commandName) || client.cmds.get(client.aliases.get(commandName));
        if(message.content == prefix || !cmd) return;

        cmd.run(message, args)
        console.log(chalk.blueBright(`[${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}] [CMD] Guild: ${chalk.bold(message.guild.name)} | Author: ${chalk.bold(message.author.username)} => ${chalk.bold(message.content)}`))
	};
};

module.exports = Message;