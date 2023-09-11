var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-commands",
  category: "💪 Setup",
  aliases: ["setupcommands", "setup-command", "setupcommand"],
  cooldown: 5,
  usage: "setup-commands  -->  Follow the Steps",
  description: "Enable/Disable specific Commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      function getMenuOptions() {
        return [
          {
            label: "ECONOMY",
            value: "ECONOMY",
            emoji: "💸",
            description: `${GuildSettings.ECONOMY ? "❌ Disable ECONOMY Commands" : "✅ Enable ECONOMY Commands"}`
          },
          {
            label: "SCHOOL",
            value: "SCHOOL",
            emoji: "🏫",
            description: `${GuildSettings.SCHOOL ? "❌ Disable SCHOOL Commands" : "✅ Enable SCHOOL Commands"}`
          },
          {
            label: "MUSIC",
            value: "MUSIC",
            emoji: "🎶",
            description: `${GuildSettings.MUSIC ? "❌ Disable Music Commands" : "✅ Enable Music Commands"}`
          },
          {
            label: "FILTER",
            value: "FILTER",
            emoji: "👀",
            description: `${GuildSettings.FILTER ? "❌ Disable FILTER Commands" : "✅ Enable FILTER Commands"}`
          },
          {
            label: "CUSTOMQUEUE",
            value: "CUSTOMQUEUE",
            emoji: "⚜️",
            description: `${GuildSettings.CUSTOMQUEUE ? "❌ Disable CUSTOM-QUEUE Commands" : "✅ Enable CUSTOM-QUEUE Commands"}`
          },
          {
            label: "PROGRAMMING",
            value: "PROGRAMMING",
            emoji: "⌨️",
            description: `${GuildSettings.PROGRAMMING ? "❌ Disable PROGRAMMING Commands" : "✅ Enable PROGRAMMING Commands"}`
          },
          {
            label: "RANKING",
            value: "RANKING",
            emoji: "📈",
            description: `${GuildSettings.RANKING ? "❌ Disable RANKING Commands" : "✅ Enable RANKING Commands"}`
          },
          {
            label: "SOUNDBOARD",
            value: "SOUNDBOARD",
            emoji: "🔊",
            description: `${GuildSettings.SOUNDBOARD ? "❌ Disable SOUNDBOARD Commands" : "✅ Enable SOUNDBOARD Commands"}`
          },
          {
            label: "VOICE",
            value: "VOICE",
            emoji: "🎤",
            description: `${GuildSettings.VOICE ? "❌ Disable VOICE Commands" : "✅ Enable VOICE Commands"}`
          },
          {
            label: "FUN",
            value: "FUN",
            emoji: "🕹️",
            description: `${GuildSettings.FUN ? "❌ Disable FUN Commands" : "✅ Enable FUN Commands"}`
          },
          {
            label: "MINIGAMES",
            value: "MINIGAMES",
            emoji: "🎮",
            description: `${GuildSettings.MINIGAMES ? "❌ Disable MINIGAMES Commands" : "✅ Enable MINIGAMES Commands"}`
          },
          {
            label: "ANIME",
            value: "ANIME",
            emoji: "😳",
            description: `${GuildSettings.ANIME ? "❌ Disable ANIME Commands" : "✅ Enable ANIME Commands"}`
          },
          {
            label: "NSFW",
            value: "NSFW",
            emoji: "🔞",
            description: `${GuildSettings.NSFW ? "❌ Disable NSFW Commands" : "✅ Enable NSFW Commands"}`
          },
        ];
      }
      function getMenuRowComponent() { 
        let menuOptions = getMenuOptions();
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Click: enable/disable Command-Categories")
          .setMinValues(1)
          .setMaxValues(menuOptions.length)
          .addOptions(menuOptions.filter(Boolean))
        return [new MessageActionRow().addComponents(menuSelection)]
      }


      let embed = new Discord.MessageEmbed()
        .setTitle(`Setup the allowed/not-allowed Command-Categories of this Server`)
        .setColor(es.color)
        .setDescription(`**In the selection down below all Categories are listed**\n\n**Select it to either disable/enable it!**\n\n**You can select all (*at least 1*) Command-Categories if you want to disable/enable all of them at once!**`)

       //Send message with buttons
      let msg = await message.reply({   
        embeds: [embed], 
        components: getMenuRowComponent()
      });
      const collector = msg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author?.id == client.user.id, time: 180e3, max: 1 });
      collector.on("collect", async b => {
        if(b?.user.id !== message.author?.id)
        return b?.reply({content: ":x: Only the one who typed the Command is allowed to select Things!", ephemeral: true});
     
        let enabled = 0, disabled = 0;
        for await (const value of b?.values) {
          let oldstate = GuildSettings[`${value.toUpperCase()}`];
          if(!oldstate) enabled++;
          else disabled++;
          GuildSettings[`${value.toUpperCase()}`] = !oldstate
        }
        await client.settings.set(message.guild.id, GuildSettings)
        GuildSettings = await client.settings.get(message.guild.id);
        b?.reply(`<a:yes:947339988780064859> **\`Enabled ${enabled} Command-Categories\` and \`Disabled ${disabled} Command-Categories\` out of \`${b?.values.length} selected Command-Categories\`**`)
      })
      collector.on('end', collected => {
        msg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
          msg.embeds[0]
            .setDescription(`${getMenuOptions().map(option => `> ${option.emoji} **${option.value}-Commands**: ${option.description.split(" ")[0] != "❌" ? `\`Are now disabled [❌]\`` : `\`Are now enabled [✅]\``}`).join("\n\n")}`)
        ], components: []}).catch((e)=>{})
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-commands"]["variable5"]))
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
function getNumberEmojis() {
  return [
      "<:Number_0:1147927819180068904>",
      "<:Number_1:1147928159082254346>",
      "<:Number_2:1147928360551465111>",
      "<:Number_3:1147928463362244628>",
      "<:Number_4:1147928595554111568>",
      "<:Number_5:1147928793181343851>",
      "<:Number_6:1147928955836444672>",
      "<:Number_7:1147929111390588991>",
      "<:Number_8:1147929234480836698>",
      "<:Number_9:1147929324599656459>",
      "<:Number_10:1147929457437446274>",
      "<:Number_11:1147929616057643088>",
      "<:Number_12:1147929957654339684>",
      "<:Number_13:1147937276236673025>",
      "<:Number_14:1147937403538002000>",
      "<:Number_15:1147937544210747403>",
      "<:Number_16:1147937648263041034>",
      "<:Number_17:1147937752076259339>",
      "<:Number_18:1147938136773632050>",
      "<:Number_19:1147938290037686283>",
      "<:Number_20:1147938384254357556>",
      "<:Number_21:1147938467247050862>",
      "<:Number_22:1147938558196334697>",
      "<:Number_23:1147938705710010458>",
      "<:Number_24:1147938796072095786>",
      "<:Number_25:1147938901613359134>"
  ]
}
