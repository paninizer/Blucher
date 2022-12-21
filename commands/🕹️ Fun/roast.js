const path = require("path");
const Machine = require('insultmachine');
module.exports = {
  name: path.parse(__filename).name,
  category: "🕹️ Fun",
  aliases: ["insult"],
  usage: `${path.parse(__filename).name} [@User]`,
  description: "Insults a user.",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    let target = message.mentions.members.first().id || message.author.id;
    await message.channel.send(`<@${target}> ${Machine.InsultMachine()}`);
  }
}