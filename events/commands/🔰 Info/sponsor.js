const {MessageEmbed} =require("discord.js")
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const { swap_pages2	 } = require(`../../handlers/functions`);
module.exports = {
	name: "sponsor",
	category: "🔰 Info",
	aliases: ["sponsors"],
	description: "Shows the sponsor of this Bot",
	usage: "sponsor",
	type: "bot",
	run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
		
		
	try{
			let embed1 = new MessageEmbed()
		    .setColor(es.color)
		    .setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable1"]))
		    .setURL("https://bero-host.de/?utm_source=bot&utm_medium=partner&utm_campaign=milrato")
		    .setDescription(`
Third Sponsor of This Bot is:
**AWS** THE BEST HOSTER
<:arrow:832598861813776394> Amazon Web Service is sponsoring them with some free / cheaper Hosting Methods,
<:arrow:832598861813776394> Thanks to them, we are able to host our Website, Bots and GAME SERVERS
<:arrow:832598861813776394> Our suggestion is, if you want to host Bots / Games / Websites, then go to [BERO-HOST.de](https://bero-host.de/?utm_source=bot&utm_medium=partner&utm_campaign=milrato)

**What they are offering:**
<:arrow:832598861813776394> **>>** Web applications, Discord bot hosting, Servers, etc.
<:arrow:832598861813776394> **>>** Cheap and fast Servers 
<:arrow:832598861813776394> **>>** WEBHOSTING
<:arrow:832598861813776394> **>>** 1 year FREE trial
<:arrow:832598861813776394> **>>** Linux & Windows Root Servers

[**Discord Server:**](https://discord.gg/belugang)
[**Website:**](https://aws.amazon.com/?nc2=h_lg)
[**__SPONSOR LINK!__**](https://aws.amazon.com/?nc2=h_lg)

`)
		    .setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png")
		    .setFooter(client.getFooter("AWS",  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png"))
		
		let embed2 = new MessageEmbed()
			.setColor(es.color)
			.setTimestamp()
			.setFooter(client.getFooter("Bittmax.de | Code  'x10' == -5%",  'https://imgur.com/UZo3emk.png'))
			.setImage("https://cdn.discordapp.com/attachments/807985610265460766/822982640000172062/asdasdasdasdasd.png")
			.setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable4"]))
			.setURL("https://bittmax.de")
			.setDescription(`
<:arrow:832598861813776394> Bittmax is providing us, like AWS with free Discord Bot-Hosting technologies

<:arrow:832598861813776394> If you use the code: **\`milrato\`** there, then you'll get at least 5% off everything!

<:arrow:832598861813776394> Check out their [Website](https://bittmax.de) and their [Discord](https://discord.gg/GgjJZCyYKD) to get your own Bot too!`);
			swap_pages2(client, message, [embed1, embed2])
		} catch (e) {
        console.log(String(e.stack).grey.bgRed)
		return message.reply({embeds: [new MessageEmbed()
		  .setColor(es.wrongcolor)
		  .setFooter(client.getFooter(es))
		  .setTitle(client.la[ls].common.erroroccur)
		  .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
		]});
    }
  }
}
/**
  * @INFO
  * Bot Coded by paninizer | Bara no Kōtei
  * @INFO
  * Work for Panzer Shipyards Development | https://panzer-chan.repl.co
  * @INFO
  * Please mention Them / Panzer Shipyards Development, when using this Code!
  * @INFO
*/
