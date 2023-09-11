const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
const axios = require("axios");

/*
const responses = [
"Yes",
"No",
"Maybe",
"Perhaps",
"Ask later when I'm less busy",
"||deez nuts||",
"||bruh   no||",
"Haha no",
"I don't know, welp..."
]
*/

module.exports = {
  name: "8ball",
  category: "🕹️ Fun",
  description: "Answers your Question",
  usage: "8ball <Questions>",
  type: "text",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.FUN === false){
      const embed1 = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      
      return message.reply({embeds : [embed1]});
    }
    try {
      const question = args.slice(0).join(" ");
      const embed2 = new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["fun"]["8ball"]["variable1"]))
      if (!question) return message.reply({embeds : [embed2]});

	let response = await axios.get(`https://www.eightballapi.com/api/biased?question=${question}&lucky=true`);
	
	const embed3 = new MessageEmbed()
	.setTitle(question)
	.setDescription(response.data.reading)
	.setColor("RANDOM")
	
	await message.channel.send({embeds: [embed3]})
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      const embed4 = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["8ball"]["variable5"]))
      return message.reply({embeds : [embed4]});
    }
  }
}