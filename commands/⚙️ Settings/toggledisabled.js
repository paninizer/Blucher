const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "toggledisabled",
  aliases: [ "toggleshowdisabled" ],
  category: "⚙️ Settings",
  description: "Toggles if the Bot help Message should show Disabled Commands or not [DEFAULT: true]",
  usage: "toggledisabled",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let showDisabled = GuildSettings.showdisabled ? true : false;
      await client.settings.set(`${message.guild.id}.showdisabled`, !showDisabled);
      showDisabled = await client.settings.get(`${message.guild.id}.showdisabled`);
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(`<a:yes:947339988780064859> ${showDisabled ? "Enabled": "Disabled"} Disabled-Cmds Showing`)
        .setDescription(`${showDisabled ? "I will now show disabled commands in the Help Menu" : "I will not show disabled Commands in the Help Menu"}`.substring(0, 2048))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggleunknowncommandinfo"]["variable2"]))
       ]} );
    }
  }
};
/**
 * @INFO
 * Bot Coded by paninizer | Bara no Kōtei
 * @INFO
 * Work for Panzer Shipyards Development | https://panzer-chan.repl.co
 * @INFO
 * Please mention Them / Panzer Shipyards Development, when using this Code!
 * @INFO
 */
