const {
  MessageEmbed
} = require(`discord.js`);
const Discord = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const fs = require('fs');
const {
  dbEnsure,
  isValidURL
} = require(`../../handlers/functions`);
module.exports = {
  name: `blacklist`,
  category: `👑 Owner`,
  type: "info",
  aliases: [`serverbl`, `guildbl`, `serverblacklist`, `guildblacklist`],
  description: `Reloads a command`,
  usage: `blacklist <GUILD ID>`,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {

    if (!config.ownerIDS.includes(message.author?.id))
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable1"]))
      ]});
    try {
      if (!args[0])
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`:x: You need to provide a guild ID`)
        ]});
			
			let guild = client.guilds.cache.get(args[0]) || client.guilds.fetch(args[0]);
			if (!guild) {
        return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`:x: You need to provide a valid guild ID`)
        ]});
			}

			await dbEnsure(client.guildBlacklist, guild.id, {
        isBlacklisted: "no"
      });

			if (client.guildBlacklist.get(guild.id)=="yes") {
				return message.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`:x: The guild is already blacklisted!`)
        ]});
			}

			await client.guildBlacklist.set(guild.id, {
				isBlacklisted: "yes"
			})

			await guild.leave();
		} catch (e) {
			console.error(e);
		}
	}
}