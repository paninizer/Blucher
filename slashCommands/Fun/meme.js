const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const https = require('https');
const subreddits = [
  "memes",
  "dankmemes",
  "meirl",
  "me_irl",
  "funny",
  "prequelmemes",
  "HistoryMemes"
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//https://www.reddit.com/r/meme/hot/.json?limit=100

const path = require("path");
module.exports = {
  name: path.parse(__filename).name,
  category: "🕹️ Fun",
  usage: `meme`,
  type: "user",
  description: "Sends a meme",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {

	await interaction.deferReply();

	const url = `https://www.reddit.com/r/${subreddits[getRandomInt(subreddits.length)]}/hot/.json?limit=100`;

	https.get(url, async (result) => {
            var body = ''
            result.on('data', (chunk) => {
                body += chunk
            })

            result.on('end', async () => {
                var response = JSON.parse(body)
                var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

                if (index.post_hint !== 'image') {

                    var text = index.selftext
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    await interaction.editReply({embeds: [textembed], ephermeral: true});
                }

                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                var title = index.title
                var link = 'https://reddit.com' + index.permalink
                var subRedditName = index.subreddit_name_prefixed

                if (index.post_hint !== 'image') {
                    const textembed = new Discord.RichEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    await interaction.editReply({embeds: [textembed], ephemeral: true})
                }
                //console.log(image); debug
                const imageembed = new Discord.MessageEmbed()
                    .setTitle(subRedditName.toString())
                    .setImage(image)
                    .setColor(9384170)
                    .setDescription(`[${title}](${link})`)
                    .setURL(`https://reddit.com/${subRedditName}`)

                await interaction.editReply({embeds: [imageembed], ephemeral: true})
            }).on('error', function (e) {
                console.log('Got an error: ', e)
            })
        })  
    }
}
// Coded by paninizer
