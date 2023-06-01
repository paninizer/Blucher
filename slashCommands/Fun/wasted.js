
const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "wasted",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "wasted @User",
  type: "user",
  options: [
    { "User": { name: "which_user", description: "From Which User do you want to get ... ?", required: false } }, //to use in the code: interacton.getUser("ping_a_user")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {

    await interaction?.deferReply({ephemeral: false});
    //find the USER
    let user = interaction?.options.getUser("which_user");
    if (!user) user = interaction?.member.user;
    let avatar = user.displayAvatarURL({
      dynamic: false,
      format: "png"
    });
    let image = await canvacord.Canvas.wasted(avatar);
    let attachment = await new MessageAttachment(image, "wasted.png");
    interaction?.editReply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setAuthor(`Meme for: ${user.tag}`, avatar)
        .setImage("attachment://wasted.png")
      ], files: [attachment], ephemeral: true
    }).catch(() => null)
  }
}
/**
 * @INFO
 * Bot Coded by paninizer#8583 | Bara no Kōtei
 * @INFO
 * Work for Panzer Shipyards Development | https://blucher.panzer-chan.repl.co/
 * @INFO
 * Please mention them / Panzer Shipyards Development, when using this Code!
 * @INFO
 */
