const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, dbEnsure } = require(`../../handlers/functions`)
module.exports = {
  name: "addmoney",
  category: "⚙️ Settings",
  aliases: ["ecoaddmoney"],
  description: "Adds Money to someone else!",
  usage: "addmoney <@USER> <Amount>",
  memberpermissions: [`ADMINISTRATOR`],
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(!GuildSettings.ECONOMY){
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
    //command
    var user  = message.author;
    var topay = message.mentions.members.filter(member=>member.guild.id == message.guild.id).first();
      if(!topay) return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable4"]))
      ]});
    topay = topay.user;
    let payamount = Number(args[1]);
    if(!payamount) return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable5"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable6"]))
      ]});
    if(user.bot || topay.bot) return message.reply({content : eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable7"])})
    
    await dbEnsure(client.economy, `${message.guild.id}-${user.id}`, {
      user: user.id,
      work: 0,
      balance: 0,
      bank: 0,
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      items: {
        yacht: 0, lamborghini: 0, car: 0, motorbike: 0,  bicycle: 0,
        nike: 0, tshirt: 0,
        mansion: 0, house: 0, dirthut: 0,
        pensil: 0, pen: 0, condom: 0, bottle: 0,
        fish: 0, hamster: 0, dog: 0, cat: 0,            
      }
    })
    
    await dbEnsure(client.economy, `${message.guild.id}-${topay.id}`, {
      user: user.id,
      work: 0,
      balance: 0,
      bank: 0,
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      items: {
        yacht: 0, lamborghini: 0, car: 0, motorbike: 0,  bicycle: 0,
        nike: 0, tshirt: 0,
        mansion: 0, house: 0, dirthut: 0,
        pensil: 0, pen: 0, condom: 0, bottle: 0,
        fish: 0, hamster: 0, dog: 0, cat: 0,          
      }
    })
    //get the economy data 
    let data2 = await client.economy.get(`${message.guild.id}-${topay.id}`)

    if(payamount <= 0) return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable8"]))
     ]} );
    
    await client.economy.set(`${message.guild.id}-${topay.id}.balance`, data2.balance + payamount)
    data2 = await client.economy.get(`${message.guild.id}-${topay.id}`)
    //return some message!
    return message.reply({embeds : [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(user.tag, user.displayAvatarURL({dynamic: true})))
      .setTitle(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable9"]))
      .setDescription(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable10"]))
    ]});
  } catch (e) {
    console.log(String(e.stack).dim.bgRed)
    return message.channel.send({embeds : [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["owner"]["addmoney"]["variable11"]))
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
