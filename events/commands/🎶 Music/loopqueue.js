const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `loopqueue`,
  category: `🎶 Music`,
  aliases: [`repeatqueue`, `lq`, `rq`, `loopqu`, `repeatqu`],
  description: `Repeats the Queue`,
  usage: `loopqueue`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queue",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //define the Embed
      const embed = new MessageEmbed()
        .setTitle(player.loop == 2 ? client.la[ls].cmds.music.loop.queue.disabled : client.la[ls].cmds.music.loop.queue.enabled)
        .setColor(es.color)

      //If trackrepeat was active add informational message + disable it
      if (player.loop == 1) {
        embed.setDescription(client.la[ls].cmds.music.loop.andsong);
        player.setLoop(null);
      }
      //change Queue Mode
      player.setLoop(2);
      //Send Success Message
      return message.reply({embeds : [embed]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["loopqueue"]["variable1"]))
      ]});
    }
  }
};

/**
 * @INFO
 * Bot Coded by paninizer | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Panzer Shipyards Development | https://panzer-chan.repl.co
 * @INFO
 * Please mention Them / Panzer Shipyards Development, when using this Code!
 * @INFO
 */
