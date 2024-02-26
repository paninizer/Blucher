var {
  MessageEmbed, MessageButton, MessageActionRow, Permissions
} = require("discord.js"),
ms = require("ms"),

config = require(`${process.cwd()}/botconfig/config.json`),
emoji = require("../../botconfig/emojis.json"),
ee = require(`${process.cwd()}/botconfig/embed.json`),

{
  createBar,
  format,
  check_if_dj,
  databasing,
  autoplay
} = require(`../functions`),
playermanager = require("../../handlers/playermanager"),

playercreated = new Map(),
collector = false,
mi;

module.exports = (client) => {
  client.manager
    .on("playerCreate", async (player) => {
      playercreated.set(player.guildId)
    })
    .on("playerMove", async (player, oldChannel, newChannel) => {
      if (!newChannel) {
        await player.destroy();
      } else {
        player.setVoiceChannel(newChannel.id);
        if (player.paused) return;
        setTimeout(() => {
          player.pause();
          setTimeout(() => player.resume(), client.ws.ping * 2);
        }, client.ws.ping * 2);
      }
    })
    .on("playerDestroy", async (player) => {
      
      if(player.textChannel && player.guildId){
        let Queuechannel = await client.getChannel(player.textChannel).catch(() => null)

        if(Queuechannel && Queuechannel.permissionsFor(Queuechannel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          Queuechannel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
            if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
              var embed = currentSongPlayMsg.embeds[0];
              embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
              embed.footer.text += "\n\n⛔️ SONG & QUEUE ENDED! | Player got DESTROYED (stopped)"
              currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => null)
            }
          }).catch(() => null)
        }
        const musicsettings = await client.musicsettings.get(player.guildId)
        if(musicsettings.channel && musicsettings.channel.length > 5){
          let messageId = musicsettings.message;
          let guild = await client.guilds.cache.get(player.guildId)
          if(guild && messageId) {
            let channel = guild.channels.cache.get(musicsettings.channel);
            let message = await channel.messages.fetch(messageId).catch(() => null);
            if(message) {
              //edit the message so that it's right!
              var data = await  require("./musicsystem").generateQueueEmbed(client, player.guildId, true)
              message.edit(data).catch(() => null)
              if(musicsettings.channel == player.textChannel){
                return;
              }
            }
          }
        }
      }
      
    })
    .on("trackStart", async (player, track) => {
      try {
        let edited = false;
        const Settings = await client.settings.get(player.guildId)
        if(playercreated.has(player.guildId)){
          await player.set("eq", "💣 None");
          await player.set("filter", "🧨 None");
          await player.setVolume(Settings.defaultvolume || 30)
          await player.set("autoplay", Settings.defaultap || false);
		  await player.setAutoPlay(Settings.defaultap || false);
          await player.set(`afk`, false);
          if(Settings.defaulteq || false){
            await player.setEQ(client.eqs.music);
          }
          databasing(client, player.guildId, player.get("playerauthor"));
          playercreated.delete(player.guildId); // delete the playercreated state from the thing
        }
        const musicsettings = await client.musicsettings.get(player.guildId)
        if(musicsettings.channel && musicsettings.channel.length > 5){
          let messageId = musicsettings.message;
          let guild = await client.guilds.cache.get(player.guildId)
          if(guild && messageId) {
            let channel = guild.channels.cache.get(musicsettings.channel);
            let message = await channel.messages.fetch(messageId).catch(() => null);
            if(message) {
              //edit the message so that it's right!
              var data = await  require("./musicsystem").generateQueueEmbed(client, player.guildId)
              message.edit(data).catch(() => null)
              if(musicsettings.channel == player.textChannel){
                return;
              }
            }
          }
        }
        if(player.textChannel && player.get("previoustrack")){
          if(!collector.ended){
            try{
              collector?.stop()
            } catch (e) {
            }
          }
          let channel = await client.getChannel(player.textChannel).catch(() => null)
          if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
            channel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
              if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
                var embed = currentSongPlayMsg.embeds[0];
                embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
                embed.footer.text += "\n⛔️ SONG ENDED!"
                currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => null)
              }
            }).catch(() => null)
          }
        }
        //votes for skip --> 0
        player.set("votes", "0");
        //set the vote of every user to FALSE so if they voteskip it will vote skip and not remove voteskip if they have voted before
        const guild = client.guilds.cache.get(player.guildId);
		//console.log(guild);
        for (var userid of guild.members.cache.map(member => member.user.id))
          player.set(`vote-${userid}`, false);
        //set the previous track just have it is used for the autoplay function!
        player.set("previoustrack", track);
        //if that's disabled return
        if(Settings.playmsg === false){
          return;
        }
        // playANewTrack(client,player,track);
        let playdata = await generateQueueEmbed(client, player, track)
        //Send message with buttons
        let channel = await client.getChannel(player.textChannel).catch(() => null)
        if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          let swapmsg = await channel.send(playdata).then(msg => {
            player.set("currentmsg", msg.id);
            return msg;
          })
          //create a collector for the thinggy
          collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.message.author?.id == client.user.id, time: track.duration > 0 ? track.duration : 600000 }); //collector for song
          //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
          collector.on('collect', async i => {
              let { member } = i;
              const { channel } = member.voice
              const player = client.manager.players.get(i?.guild.id);
              if (!player)
                return i?.reply({content: "<a:animated_wrong:947340139359789106> Nothing Playing yet", ephemeral: true})
                
              if (!channel)
                return i?.reply({
                  content: `<a:animated_wrong:947340139359789106> **Please join a Voice Channel first!**`,
                  ephemeral: true
                })                  
              if (channel.id !== player.voiceChannel)
                return i?.reply({
                  content: `<a:animated_wrong:947340139359789106> **Please join __my__ Voice Channel first! <#${player.voiceChannel}>**`,
                  ephemeral: true
                })
              const es = Settings.embed || ee;
              const dj = await check_if_dj(client, member, player.queue.current);
              if(i?.customId != `10` && dj) {
                return i?.reply({embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                  .setTitle(`<a:animated_wrong:947340139359789106> **You are not a DJ and not the Song Requester!**`)
                  .setDescription(`**DJ-ROLES:**\n${dj}`)
                ],
                ephemeral: true});
              }

              
              //skip
              if(i?.customId == "1") {
                //if ther is nothing more to skip then stop music and leave the Channel
                if (player.queue.size == 0) {
                  //if its on autoplay mode, then do autoplay before leaving...
                  if(player.autoPlay) return autoplay(client, player, "skip");
                  i?.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(`⏹ **Stopped playing and left the Channel**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                  })
                  edited = true;
                  player.destroy()
                  return
                }
                //skip the track
                player.stop();
                return i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(`⏭ **Skipped to the next Song!**`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }



              //stop
              if(i?.customId == "2") {
                //Stop the player
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(`⏹ **Stopped playing and left the Channel**`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                }) 
                edited = true;
                player.destroy()
              }



              //pause/resume
              if(i?.customId == "3") {
                if (player.paused){
                  await player.resume();
                  await i?.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(`▶️ **Resumed!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                  })
                } else{
                  //pause the player
                  await player.pause(true);
				  //console.log(player.paused);
                  await i?.reply({
                    embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(`⏸ **Paused!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                  })
                }
                var data = generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.error(e)
                })
              }



              //autoplay
              if(i?.customId == "4") {
                //pause the player
                player.set(`autoplay`, !player.autoPlay);
				player.setAutoPlay(!player.autoPlay);
                var data = await generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.error(e)
                })
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(`${player.autoPlay ? `<a:yes:947339988780064859> **Enabled Autoplay**`: `<a:animated_wrong:947340139359789106> **Disabled Autoplay**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }


              //Shuffle
              if(i?.customId == `5`){
                //set into the player instance an old Queue, before the shuffle...
                player.set(`beforeshuffle`, player.queue.map(track => track));
                //shuffle the Queue
                player.queue.shuffle();
                //Send Success Message
                i?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(`🔀 **Shuffled ${player.queue.length} Songs!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }


              //Songloop
              if(i?.customId == `6`){
               //set track repeat to revers of old track repeat
                player.setLoop(!player.loop);
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(`${player.loop ? `<a:yes:947339988780064859> **Enabled Song Loop**`: `<:no:947340139359789106> **Disabled Song Loop**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                var data = generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.error(e)
                })
              }


              //QueueLoop
              if(i?.customId == `7`){
                //if there is active queue loop, disable it + add embed information
                if (player.trackRepeat) {
                  player.setTrackRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setQueueRepeat(!player.queueRepeat);
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(es.color)
                  .setTimestamp()
                  .setTitle(`${player.queueRepeat ? `<a:yes:947339988780064859> **Enabled Queue Loop**`: `<a:animated_wrong:947340139359789106> **Disabled Queue Loop**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                var data = generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.error(e)
                })
              }


              //Forward
              if(i?.customId == `8`){
                //get the seektime variable of the user input
                let seektime = Number(player.position) + 10 * 1000;
                //if the userinput is smaller then 0, then set the seektime to just the player.position
                if (seektime <= player.current.duration - player.position || seektime < 0) {
                  seektime = 0;
                }
                //if the seektime is too big, then set it 1 sec earlier
                if (Number(seektime) >= player.current.duration) seektime = player.current.duration - 1000;
                //seek to the new Seek position
                player.seek(Number(seektime));
                collector.resetTimer({time: (player.current.duration - player.position) * 1000})
                i?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(`⏩ **Forwarded the song for \`10 Seconds\`!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }

              
              //Rewind
              if(i?.customId == `9`){
                let seektime = player.position - 10 * 1000;
                if (seektime >= player.current.duration - player.position || seektime < 0) {
                  seektime = 0;
                }
                //seek to the new Seek position
                player.seek(Number(seektime));
                collector.resetTimer({time: (player.current.duration - player.position) * 1000})
                i?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTimestamp()
                    .setTitle(`⏪ **Rewinded the song for \`10 Seconds\`!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }
          });  
        }
                
      } catch (e) {
        console.log(String(e.stack).grey.yellow) /* */
      }
    })
    .on("trackStuck", async (player, track, payload) => {
      await player.stop();
      if(player.textChannel){
        let channel = await client.getChannel(player.textChannel).catch(() => null)
        if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          channel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
            if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
              var embed = currentSongPlayMsg.embeds[0];
              embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
              embed.footer.text += "\n⚠️⚠️⚠️ SONG STUCKED ⚠️⚠️!"
              currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => null)
            }
          }).catch(() => null)
        }
        const musicsettings = await client.musicsettings.get(player.guildId)
        if(musicsettings.channel && musicsettings.channel.length > 5){
          let messageId = musicsettings.message;
          let guild = await client.guilds.cache.get(player.guildId)
          if(guild && messageId) {
            let channel = guild.channels.cache.get(musicsettings.channel);
            let message = await channel.messages.fetch(messageId).catch(() => null);
            if(message) {
              //edit the message so that it's right!
              var data = await  require("./musicsystem").generateQueueEmbed(client, player.guildId)
              message.edit(data).catch(() => null)
              if(musicsettings.channel == player.textChannel){
                return;
              }
            }
          }
        }
      }
    })
    .on("trackError", async (player, track, payload) => {
      await player.stop();
      if(player.textChannel){
        let channel = await client.getChannel(player.textChannel).catch(() => null)
        if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          channel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
            if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
              var embed = currentSongPlayMsg.embeds[0];
              embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
              embed.footer.text += "\n⚠️⚠️⚠️ SONG CRASHED ⚠️⚠️!"
              currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => null)
            }
          }).catch(() => null)
        }
        const musicsettings = await client.musicsettings.get(player.guildId)
        if(musicsettings.channel && musicsettings.channel.length > 5){
          let messageId = musicsettings.message;
          let guild = await client.guilds.cache.get(player.guildId)
          if(guild && messageId) {
            let channel = guild.channels.cache.get(musicsettings.channel);
            let message = await channel.messages.fetch(messageId).catch(() => null);
            if(message) {
              //edit the message so that it's right!
              var data = await  require("./musicsystem").generateQueueEmbed(client, player.guildId)
              message.edit(data).catch(() => null)
              if(musicsettings.channel == player.textChannel){
                return;
              }
            }
          }
        }
      }
    })
    .on("queueEnd", async (player) => {
      databasing(client, player.guildId, player.get("playerauthor"));
      if (player.get("autoplay")) return autoplay(client, player);
      //DEvar TIME OUT
      try {
        player = client.manager.players.get(player.guildId);
        if (!player.queue || !player.current) {
          
        const musicsettings = await client.musicsettings.get(player.guildId)
        if(musicsettings.channel && musicsettings.channel.length > 5){
          let messageId = musicsettings.message;
          let guild = await client.guilds.cache.get(player.guildId)
          if(guild && messageId) {
            let channel = guild.channels.cache.get(musicsettings.channel);
            let message = await channel.messages.fetch(messageId).catch(() => null);
            if(message) {
              //edit the message so that it's right!
              var data = await  await  require("./musicsystem").generateQueueEmbed(client, player.guildId, true)
              message.edit(data).catch(() => null)
              if(musicsettings.channel == player.textChannel){
                return;
              }
            }
          }
        }
          //if afk is enbaled return and not destroy the PLAYER
          if (player.get("afk")){
            return;
          }
          await player.destroy();
          
        }
      } catch (e) {
        console.log(String(e.stack).grey.yellow);
      }
    });
};


async function generateQueueEmbed(client, player, track){
  //console.log(track.requester.tag);
  let author = await client.users.fetch(track.requester.id);
  //console.log(author.tag);
  var embed = new MessageEmbed().setColor(ee.color)
    embed.setAuthor(client.getAuthor(`${track.title}`, "https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif", track.url))
    embed.setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
    embed.setFooter(client.getFooter(`Requested by: ${track.requester.tag}`, author.displayAvatarURL({dynamic: true})));
  let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`).setLabel(`Skip`)
  let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`🏠`).setLabel(`Stop`)
  let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('⏸').setLabel(`Pause`)
  let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('4').setEmoji('🔁').setLabel(`Autoplay`)
  let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('🔀').setLabel(`Shuffle`)
  //console.log(player.paused);

  if (player.paused) {
    pause = pause.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
  }
  if (player.autoPlay) {
    autoplay = autoplay.setStyle('SECONDARY')
  }
  let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji(`🔁`).setLabel(`Song`)
  let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`🔂`).setLabel(`Queue`)
  let forward = new MessageButton().setStyle('PRIMARY').setCustomId('8').setEmoji('⏩').setLabel(`+10 Sec`)
  let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('9').setEmoji('⏪').setLabel(`-10 Sec`)
  let lyrics = new MessageButton().setStyle('PRIMARY').setCustomId('10').setEmoji('📝').setLabel(`Lyrics`).setDisabled();
  if (!player.queueRepeat && !player.trackRepeat) {
    songloop = songloop.setStyle('SUCCESS')
    queueloop = queueloop.setStyle('SUCCESS')
  }
  if (player.trackRepeat) {
    songloop = songloop.setStyle('SECONDARY')
    queueloop = queueloop.setStyle('SUCCESS')
  }
  if (player.queueRepeat) {
    songloop = songloop.setStyle('SUCCESS')
    queueloop = queueloop.setStyle('SECONDARY')
  }
  const row = new MessageActionRow().addComponents([skip, stop, pause, autoplay, shuffle]);
  const row2 = new MessageActionRow().addComponents([songloop, queueloop, forward, rewind, lyrics]);
  return {
    embeds: [embed], 
    components: [row, row2]
  }
}