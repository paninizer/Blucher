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
  name: `cmdreload`,
  category: `👑 Owner`,
  type: "info",
  aliases: [`commandreload`],
  description: `Reloads a command`,
  usage: `cmdreload <CMD>`,
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
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable2"]))
        ]});
        let reload = false;
        let thecmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if(!thecmd)return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable3"]))
        ]});
        /*
          delete require.cache[require.resolve(`../${thecmd.category}/${thecmd.name}`)] // usage !reload <name>
          client.commands.delete(thecmd.name)
          const pull = require(`../${thecmd.category}/${thecmd.name}`)
          client.commands.set(thecmd.name, pull)
        */
        let d = await client.cluster.broadcastEval(async (c, ctx) => {
          let thecmd = ctx;
          if(thecmd){
            try {
              delete require.cache[require.resolve(`${process.cwd()}/commands/${thecmd.category}/${thecmd.name}`)] // usage !reload <name>
              c.commands.delete(thecmd.name)
              const pull = require(`${process.cwd()}/commands/${thecmd.category}/${thecmd.name}`)
              c.commands.set(thecmd.name, pull)
              return { success: true, error: false };
            } catch (e) {
              console.error(e)
              return { success: false, error: e };
            }
          }
        }, { context: { name: thecmd.name, category: thecmd.category } })
          
        reload = true;
      if(d.some(x => x.error)) {
        return message.reply(`Failed to reload on some shards...\n\`\`\`\n${String(d.find(x => x.error)?.[0]).substring(0, 250)}\n\`\`\``);
      }
      if (reload)
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable4"]))
        ]});
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable5"]))
        .setDescription(`Cmd is now removed from the BOT COMMANDS!`)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable6"]))
      ]});
    }
  },
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
