const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  format,
  delay,
  swap_pages,
  swap_pages2
} = require(`../../handlers/functions`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `queue`,
  category: `🎶 Music`,
  aliases: [`qu`, `que`, `queu`, `list`],
  description: `Shows the Queue`,
  usage: `queue`,
  parameters: {
    "type": "music",
    "activeplayer": true,
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
      //get the right tracks of the current tracks
      const tracks = player.queue;
      //if there are no other tracks, information
      if (!tracks.size)
        return message.reply({embeds : [new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}  -  [ ${player.queue.size} Tracks ]`, message.guild.iconURL({
            dynamic: true
          }))
          .setColor(es.color).addField(eval(client.la[ls]["cmds"]["music"]["queue"]["variablex_1"]), eval(client.la[ls]["cmds"]["music"]["queue"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["queue"]["variable2"]))
        ]}).then(async (msg) => {
          setTimeout(()=>{try { 
            msg.delete().catch(() => null);
          } catch {} 
          }, 5000)
        })
      //if not too big send queue in channel
      if (tracks.size < 15)
        return message.reply({embeds :[new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}  -  [ ${player.queue.size} Tracks ]`, message.guild.iconURL({
            dynamic: true
          }))
          .addField(`**\` 0. \` __CURRENT TRACK__**`, `**${player.current.url ? `[${player.current.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.current.url})`: player.current.title}** - \`${player.current.isStream ? `LIVE STREAM` : format(player.current.duration).split(` | `)[0]}\`\n> *Requested by: __${player.current.requester.tag}__*`)
          .setColor(es.color).setDescription(tracks.all.map((track, index) => `**\` ${++index}. \`${track.url ? `[${track.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.url})`: track.title}** - \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}\`\n> *Requested by: __${track.requester.tag}__*`).join(`\n`))
        ]}).then(async (msg) => {
          setTimeout(()=>{try { 
            msg.delete().catch(() => null);
          } catch {} 
          }, 5000)
        })
      //get an array of quelist where 15 tracks is one index in the array
      let quelist = [];
      var maxTracks = 10; //tracks / Queue Page
      for (let i = 0; i < tracks.size; i += maxTracks) {
        let songs = tracks.all.slice(i, i + maxTracks);
        quelist.push(songs.map((track, index) => `**\` ${i + ++index}. \`${track.url ? `[${track.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.url})` : track.title}** - \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}\`\n> *Requested by: __${track.requester.tag}__*`).join(`\n`))
      }
      let limit = quelist.length <= 5 ? quelist.length : 5
      let embeds = []
      for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substring(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}  -  [ ${player.queue.size} Tracks ]`, message.guild.iconURL({
            dynamic: true
          }))
          .addField(`**\` N. \` *${player.queue.size > maxTracks ? player.queue.size - maxTracks : player.queue.size} other Tracks ...***`, `\u200b`)
          .setColor(es.color)
          .addField(`**\` 0. \` __CURRENT TRACK__**`, `**${player.current.url ? `[${player.current.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.current.url})`: player.current.title}** - \`${player.current.isStream ? `LIVE STREAM` : format(player.current.duration).split(` | `)[0]}\`\n> *Requested by: __${player.current.requester.tag}__*`)
          .setDescription(desc));
      }
      //return susccess message
      return swap_pages2(client, message, embeds)
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["queue"]["variable5"]))
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
