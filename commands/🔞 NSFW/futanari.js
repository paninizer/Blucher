const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();
const config = require(`../../botconfig/config.json`)
const {
  MessageEmbed
} = require('discord.js')
module.exports = {
  name: "futanari",
  category: "🔞 NSFW",
  usage: "futanari",
  type: "anime",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    if(GuildSettings.NSFW === false) {
      const x = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
          prefix: prefix
        }))
      return message.reply({
        embeds: [x]
      });
    }
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]))
    
      let owo = (await neko.nsfw.futanari());
      message.reply({
        content: `${owo.url}`
      });
  }
};