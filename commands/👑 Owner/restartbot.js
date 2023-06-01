var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, isValidURL
} = require(`../../handlers/functions`);
module.exports = {
  name: "restartbot",
  category: "👑 Owner",
  aliases: ["botrestart"],
  cooldown: 5,
  usage: "restartbot",
  type: "bot",
  description: "Restarts the Bot, if it`s not working as intended, and to prevent any undefined verdicts.",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    if ("744625722714357800" !== message.author?.id)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["eval"]["variable1"]))
      ]});
    try {
      await message.reply("NOW RESTARTING!");
      require("child_process").exec(`pm2 restart index.js`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          message.reply({content : eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable4"])})
          return;
        }
        message.reply({content : eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable5"])})
      });
      message.reply({content : eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable6"])})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["restartbot"]["variable7"]))
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by paninizer#8583 | Bara no Kōtei
 * @INFO
 * Work for Panzer Shipyards Development | https://blucher.panzer-chan.repl.co/
 * @INFO
 * Please mention them / Panzer Shipyards Development, when using this Code!
 * @INFO
 */