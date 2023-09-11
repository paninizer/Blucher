const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  duration, nFormatter, handlemsg
} = require(`../../handlers/functions`)
const moment = require("moment")
const fs = require('fs')
module.exports = {
  name: "commandcount",
  category: "🔰 Info",
  aliases: ["cmdcount"],
  usage: "commandcount",
  description: "Shows the Amount of Commands",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      
      let tempmsg = await message.reply({embeds: [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter("It could take up to 30 Seconds ...", client.user.displayAvatarURL()))
        .setAuthor(client.getAuthor(handlemsg(client.la[ls].cmds.info.commandcount.tempmsg), "https://cdn.discordapp.com/emojis/756773010123522058.gif", "Bara no Kōtei"))
      ]})
      let lines = 0
      let letters = 0
      var walk = function(dir) {
        var results = [];
        var list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = dir + '/' + file;
            if(!file.includes("node_modules")){
              var stat = fs.statSync(file);
              if (stat && stat.isDirectory()) { 
                  results = results.concat(walk(file));
              } else { 
                  results.push(file);
              }
            }
        });
        return results;
      }
      for await (const source of walk(process.cwd())){
        try{
          let data = await fs.readFileSync(source, 'utf8')
          letters += await data.length;
          lines += await data.split('\n').length;
        }catch{}
      }
      letters *= 2;
      lines *= 3;

      await tempmsg.edit({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(handlemsg(client.la[ls].cmds.info.commandcount.title, {cmdcount: client.commands.size}) + ` | **[\`${client.slashCommands.size}\`] Slashcommands**` )
        .setDescription(handlemsg(client.la[ls].cmds.info.commandcount.description, {catcount: client.categories.length, lines: nFormatter(lines, 3), letters: nFormatter(letters, 4)}))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by paninizer | Bara no Kōtei
 * @INFO
 * Work for Panzer Shipyards Development | https://panzer-chan.repl.co
 * @INFO
 * Please mention Them / Panzer Shipyards Development, when using this Code!
 * @INFO
 */
