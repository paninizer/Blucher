const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const themes = require('anime-themes');
module.exports = {
  name: "animeinfo",
  aliases: ["ainfo", "anime-info"],
  category: "🔰 Info",
  description: "Get the Title or Themes of an Anime",
  usage: "avatar [\"title\"/\"id\"] [title or MyAnime.net ID]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      if (args[0]==="title") {
        await themes.search(args[1]).then(async (anime) => {
          let counter=1;
          const aembed = new MessageEmbed()
            .setTitle("Query Answered Successfully")

          for (theme of anime.themes) {
            aembed.addFields({name: `Theme ${counter}`, value: `${theme.title}`})
          }
          
          await message.channel.send({embeds:[aembed]});
        })
      } else if (args[0]==="id") {
        await themes.search(args[1]).then(async (anime) => {
            const aembed = new MessageEmbed()
            .setTitle("Query Answered Successfully")

            aembed.setDescription(`Query result: ${anime.title}`)

            await message.channel.send({embeds: [aembed]});
        })
      } else {
        await message.reply(`You must provide a valid query **IDENTIFIER**! Use \`${prefix}help animeinfo\` to check the usage of this command!`);
      }
    } catch (err) {
      await message.channel.send(`Your query errored out! Please try to send valid inputs!`);
    }
  }
}