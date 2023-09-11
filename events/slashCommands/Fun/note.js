const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "note",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "note <TEXT>",
  type: "text",
  options: [
    { "String": { name: "text", description: "What should I send? [ +n+ = Newline ]", required: true } }, //to use in the code: interacton.getString("title")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, GuildSettings) => {

    await interaction?.deferReply({ephemeral: false});
    //get the additional text
    const text = interaction?.options.getString("text"); //same as in StringChoices //RETURNS STRING 
    //If no text added, return error
    if (!text) return interaction?.editReply({
      ephemeral: false,
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["fun"]["note"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["note"]["variable3"]))
      ]
    }).catch(() => null)

    //get the memer image
    client.memer.note(text).then(image => {
      //make an attachment
      var attachment = new MessageAttachment(image, "note.png");
      //send new Message
      interaction?.editReply({
        ephemeral: false,
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setAuthor(`Meme for: ${message.author.tag}`, message.author.displayAvatarURL())
          .setImage("attachment://note.png")
        ], files: [attachment]
      }).catch(() => null)
    })

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
