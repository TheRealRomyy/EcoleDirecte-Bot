const Command = require("../../structure/Commands.js");
const EcoleDirecte = require("node-ecole-directe");

class Moyenne extends Command {

    constructor(client) {
        super(client, {
            name: "moyenne",
            aliases: [],
            enabled: true,
            userPerms: [],
            permLevel: 1,
        });
    };

    async run(message, args) {

        if(!this.client.ecoledirecte.users.find((users) => users.id === message.author.id)) return message.shield("ecoledirecte:NO_LOGIN", {
            emoji: "error",
            prefix: this.client.cfg.prefix
        });

        let msg = await message.channel.send(this.client.emotes["waiting"] + " " + await this.client.translate("common:WAITING"));

        const session = new EcoleDirecte.Session();
        const account = await session.connexion(this.client.ecoledirecte.users.find((users) => users.id === message.author.id).username, this.client.ecoledirecte.users.find((users) => users.id === message.author.id).password);

        const notes = await account.fetchNotes();
        let total = 0;
        let count = 0;

        notes.notes.forEach((note) => {
            if(isNaN(note.valeur)) return;
            if(note.noteSur == 0) return;
            total += parseInt((note.valeur / note.noteSur * 20) * note.coef);
            count += parseInt(note.coef);
        });

        await msg.edit("Ta moyenne est de: **" + (total / count).toString() + "**");
    };
};

module.exports = Moyenne;