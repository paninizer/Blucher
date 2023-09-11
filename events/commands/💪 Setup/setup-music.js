var { MessageEmbed } = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var radios = require(`../../botconfig/radiostations.json`);
var playermanager = require(`../../handlers/playermanager`);
var { stations, dbEnsure } = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
    name: "setup-music",
    category: "💪 Setup",
    aliases: ["setupmusic"],
    cooldown: 10,
    usage: "setup-music #Channel",
    description: "Setup a Music Request Channel",
    memberpermissions: ["ADMINISTRATOR"],
    type: "fun",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
      try{
        //I AM NOW MAKING A MUSIC REQUEST SYSTEM FOR A BOT!
        await dbEnsure(client.musicsettings, message.guild.id, {
          "channel": "",
          "message": ""
        })
        //first declare all embeds
        var embeds = [
          new MessageEmbed()
            .setColor(es.color)
            .setTitle(`📃 Queue of __${message.guild.name}__`)
            .setDescription(`**Currently there are __0 Songs__ in the Queue**`)
            .setThumbnail(message.guild.iconURL({dynamic: true})),
          new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setImage(message.guild.banner ? message.guild.bannerURL({size: 4096}) : "https://imgur.com/jLvYdb4.png")
            .setTitle(`Start Listening to Music, by connecting to a Voice Channel and sending either the **SONG LINK** or **SONG NAME** in this Channel!`)
            .setDescription(`> *I support <:Youtube:840260133686870036> Youtube, <:Spotify:846090652231663647> Spotify, <:soundcloud:825095625884434462> Soundcloud and direct MP3 Links!*`)
        ]
        //now we add the components!
        var components = [
          new MessageActionRow().addComponents([
            new MessageButton().setStyle('SUCCESS').setCustomId('Join').setEmoji(`👌`).setLabel(`Join`).setDisabled(false),
            new MessageButton().setStyle('DANGER').setCustomId('Leave').setEmoji(`👋`).setLabel(`Leave`).setDisabled(),
          ]),
          new MessageActionRow().addComponents([
            new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`⏭`).setLabel(`Skip`).setDisabled(),
            new MessageButton().setStyle('DANGER').setCustomId('Stop').setEmoji(`🏠`).setLabel(`Stop`).setDisabled(),
            new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏸').setLabel(`Pause`).setDisabled(),
            new MessageButton().setStyle('SUCCESS').setCustomId('Autoplay').setEmoji('🔁').setLabel(`Autoplay`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('🔀').setLabel(`Shuffle`).setDisabled(),
          ]),
          new MessageActionRow().addComponents([
            new MessageButton().setStyle('SUCCESS').setCustomId('Song').setEmoji(`🔁`).setLabel(`Song`).setDisabled(),
            new MessageButton().setStyle('SUCCESS').setCustomId('Queue').setEmoji(`🔂`).setLabel(`Queue`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Sec`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Sec`).setDisabled(),
            new MessageButton().setStyle('PRIMARY').setCustomId('Lyrics').setEmoji('📝').setLabel(`Lyrics`).setDisabled(),
          ]),
        ]
        let channel = message.mentions.channels.first();
        if(!channel) return message.reply(":x: **You forgot to ping a Text-Channel!**")
        //send the data in the channel
        channel.send({embeds, components}).then(async (msg) => {
          await client.musicsettings.set(message.guild.id+".channel", channel.id);
          await client.musicsettings.set(message.guild.id+".message", msg.id);
          //send a success message
          return message.reply(`✅ **Successfully setupped the Music System in:** <#${channel.id}>`)
        });
        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
    						.setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable9"]))
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
