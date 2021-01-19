const Command = require("../../structure/commands.js");

const { MessageEmbed } = require("discord.js");
const EcoleDirecte = require("node-ecole-directe");

class Login extends Command {

    constructor(client) {

        super(client, {
            name: "login",
            aliases: [],
            enabled: true,
            userPerms: [],
            permLevel: 1
        });
    };

    async run(message, args) {

        let client = this.client;
        let msg = null;

        let filter = (reaction, user) => {
            return ['1️⃣', '2️⃣', '3️⃣', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        const opt = { max: 1, time: 90000, errors: [ "time" ] };
        let account = null;
        let rememberMe = false;

        let username = await client.translate("ecoledirecte:ENTER_USERNAME");
        let password = await client.translate("ecoledirecte:ENTER_PASSWORD");
        let passwordSecret = await client.translate("ecoledirecte:ENTER_PASSWORD");

        async function WaitForReaction(msg) {

            let reaction = null;

            await msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
                reaction = collected.first();
                reaction.users.remove(message.author.id);
            }).catch(collected => {
                return cancel();
            });

            if(reaction == null) return;
            return reaction.emoji.name;
        };

        
        async function WaitForText(msg) {

            filter = (m) => m.author.id === message.author.id;

            let collected = await message.channel.awaitMessages(filter, opt).catch(() => {});
            if (!collected || !collected.first()) return cancel();
            const confMessage = collected.first().content;
            if(confMessage === "cancel") return cancel();
            collected.first().delete().catch(() => {});

            filter = (reaction, user) => {
                return ['1️⃣', '2️⃣', '3️⃣', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            return confMessage;
        };

        async function cancel() {

            msg.delete().catch(() => {});
            message.delete().catch(() => {});
        }

        async function displayMain(msg) {

            let embed = new MessageEmbed()
            .setTitle(await client.translate("ecoledirecte:TITLE_LOGIN"))
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(await client.translate("ecoledirecte:FOOTER_LOGIN"))
            .setColor("#099CFE")
            .addField(await client.translate("ecoledirecte:FIRST_LOGIN"), username)
            .addField(await client.translate("ecoledirecte:SECOND_LOGIN"), password)
            .addField(await client.translate("ecoledirecte:THIRD_LOGIN"), await client.translate("common:NO"))

            return msg.edit(embed);
        }

        async function wait() {

            const embed = new MessageEmbed()
            .setTitle(await client.translate("ecoledirecte:TITLE_LOGIN"))
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(client.cfg.footer)
            .setColor("#099CFE")
            .setDescription(client.emotes["waiting"] + " " + await client.translate("common:WAITING"))

            return message.channel.send(embed);
        }

        async function start() {

            msg = await wait();

            await msg.react('1️⃣');
            await msg.react('2️⃣');
            await msg.react('3️⃣');
            await msg.react('✅');

            msg = await displayMain(msg);

            const toModify = await WaitForReaction(msg);
            await switchTM(toModify);
        }

        async function after() {
            const r = await WaitForReaction(msg);
            await switchTM(r);
        }

        async function updateEmbed(msg) {
            const embed = new MessageEmbed()
            .setTitle(await client.translate("ecoledirecte:TITLE_LOGIN"))
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(await client.translate("ecoledirecte:FOOTER_LOGIN"))
            .setColor("#099CFE")
            .addField(await client.translate("ecoledirecte:FIRST_LOGIN"), username)
            .addField(await client.translate("ecoledirecte:SECOND_LOGIN"), passwordSecret)
            .addField(await client.translate("ecoledirecte:THIRD_LOGIN"), rememberMe ? await client.translate("common:YES") : await client.translate("common:NO"));
            msg.edit(embed);
        }

        async function changePassword(pswd) {

            let count = parseInt(pswd.length);
            let newPassword = "``";

            for(let i = 0; i < count; i++) {
                newPassword += "*";
            }

            newPassword += "``";
            return newPassword;
        }

        async function switchTM(tm) {
            switch(tm) {
                case '1️⃣':
                    let msg2 = await message.channel.send(client.emotes["write"] + " " + await client.translate("ecoledirecte:INSTRUCTION_ONE_LOGIN"));
                    username = await WaitForText(msg);
                    await updateEmbed(msg);
                    msg2.delete().catch(() => {});
                    await after();
                    break;
                case '2️⃣':
                    let msg3 = await message.channel.send(client.emotes["write"] + " " + await client.translate("ecoledirecte:INSTRUCTION_TWO_LOGIN"));
                    password = await WaitForText(msg);
                    passwordSecret = await changePassword(password);
                    await updateEmbed(msg);
                    msg3.delete().catch(() => {});
                    await after();
                    break;
                case '3️⃣':
                    rememberMe ? rememberMe = false : rememberMe = true;
                    await updateEmbed(msg);
                    await after();
                    break;
                case '✅':
                    await msg.delete().catch(() => {});

                    try {
                        const session = new EcoleDirecte.Session()
                        account = await session.connexion(username, password)
                    } catch(err) {
                        return message.channel.send(client.emotes["error"] + " " + await client.translate("ecoledirecte:ERROR_LOGIN"))
                    };
                        
                    const caseInfo = {
                        "id": message.author.id, 
                        "username": username,
                        "password": password
                    };
                    client.ecoledirecte.users.push(caseInfo);

                    if(rememberMe); // Do nothing x)
                    
                    message.channel.send(client.emotes["succes"] + " " + await client.translate("ecoledirecte:CONNECTED_LOGIN", {
                        prenom: account.prenom,
                        nom: account.nom
                    }));
                    break;
                default:
                    return;
            }
        }

        const tm = await start();
        await switchTM(tm);
    };
};

module.exports = Login;