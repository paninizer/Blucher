const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "rob",
  category: "💸 Economy",
  description: "Rob Money from a Specific User, you can Ping him, add his ID / Username, it will be a random amount!",
  usage: "rob @USER",
  type: "game",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
        if(GuildSettings.ECONOMY === false){
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
    try {
      //command
      var user;
      if(args[0]){
        try{
            user = await GetUser(message, args)
        }catch (e){
          if(!e) return message.reply(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable1"]))
          return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
        }
      }
      if(!user)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable3"]))
        ]});
      if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable4"]))
      
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, message.author?.id)
      //get the economy data 
      let data = await client.economy.get(`${message.guild.id}_${message.author?.id}`)
      let data2 = await client.economy.get(`${message.guild.id}_${user.id}`)

      //get the delays
      let timeout = 86400000;

      if(data.rob !== 0 && timeout - (Date.now() - data.rob) > 0){
        let time = duration(timeout - (Date.now() - data.rob));
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable5"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable6"]))]
        });
      } 
      //YEA
      else {
        if(data2.balance < 500) return message.reply(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable7"]))
        let amountarray = [300, 350, 400, 340, 360, 350, 355, 345, 365, 350, 340, 360, 325, 375, 312.5, 387.5];
        let amount = Math.floor(amountarray[Math.floor((Math.random() * amountarray.length))]);
        amount = amount * data.black_market.boost.multiplier
        //add the Money to the User's Balance in this Guild
        await client.economy.add(`${message.guild.id}_${message.author?.id}.balance`,amount)
        await client.economy.subtract(`${message.guild.id}_${user.id}.balance`, Number(amount))
        //set the current time to the db
        await client.economy.set(`${message.guild.id}_${message.author?.id}.rob`, Date.now())
        //get the new data
        data = await client.economy.get(`${message.guild.id}_${message.author?.id}`)
        //return some message!
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable9"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["rob"]["variable10"]))
      ]});
    }
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
