const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `replay`,
  description: `Replays the current song`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {
    
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({ephemeral: true, embed : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //seek to 0
      player.seek(0);
      //send informational message
      interaction?.reply({embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(`🔃 Replaying the Track!`)
      ]})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};
/**
 * @INFO
 * Bot Coded by paninizer#8583 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Panzer Shipyards Development | https://blucher.panzer-chan.repl.co/
 * @INFO
 * Please mention them / Panzer Shipyards Development, when using this Code!
 * @INFO
 */
