const fetch = require("node-fetch");
const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
const https = require('https');

const axios = require("axios");
const subreddits = [
  "memes",
  "dankmemes",
  "meirl",
  "me_irl",
  "funny",
  "prequelmemes",
  "HistoryMemes"
];
const path = require("path");
module.exports = {
  name: path.parse(__filename).name,
  category: "🕹️ Fun",
  usage: `meme`,
  type: "user",
  description: "Sends a meme.",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
        if(GuildSettings.FUN === false){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
    try {
		const url = `https://www.reddit.com/r/${subreddits[getRandomInt(subreddits.length)]}/hot/.json?limit=50`;
		const response = await axios.get(url)

		
							//console.log(response.data);
                  			var index = response.data.data.children[Math.floor(Math.random() * 49) + 1].data
                			var image = index.preview.images[0].source.url.replace(/&amp;/g, "&");
                			var title = index.title
                			var link = 'https://reddit.com' + index.permalink
                			var subRedditName = index.subreddit_name_prefixed


                			if (index.post_hint !== 'image') {

                    				var text = index.selftext
                    				const textembed = new Discord.MessageEmbed()
                        			.setTitle(subRedditName)
                        			.setColor(9384170)
                        			.setDescription(`[${title}](${link})\n\n${text}`)
                        			.setURL(`https://reddit.com/${subRedditName}`)

                    				await message.channel.send({embeds: [textembed]});
                			}

                			if (index.post_hint !== 'image') {
                    				const textembed = new Discord.MessageEmbed()
                        			.setTitle(subRedditName)
                        			.setColor(9384170)
                        			.setDescription(`[${title}](${link})\n\n${text}`)
                        			.setURL(`https://reddit.com/${subRedditName}`)

                    				await message.channel.send({embeds: [textembed]})
                			}
                			//console.log(image);
                			const imageembed = new Discord.MessageEmbed()
                    			.setTitle(subRedditName)
                    			.setImage(image)
                    			.setColor(9384170)
                    			.setDescription(`[${title}](${link})`)
                    			.setURL(`https://reddit.com/${subRedditName}`)
                			await message.channel.send({embeds: [imageembed]})

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["meme"]["variable2"]))
      ]});
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}