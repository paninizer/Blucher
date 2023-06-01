var {
  MessageEmbed
} = require("discord.js")
var ee = require(`${process.cwd()}/botconfig/embed.json`)
var config = require(`${process.cwd()}/botconfig/config.json`)
var {
  format,
  delay,
  arrayMove,
  isValidURL
} = require("../functions")

//function for playling song
async function song(client, message, args, type, slashCommand, extras) {
  let guildSettings = await client.settings.get(message.guild.id);
  let ls = guildSettings.language;
  var search = args.join(" ");
  var res;
  var player = client.manager.players.get(message.guild.id);
  //if no node, connect it 
  if (player && player.node && !player.node.connected) await player.node.connect()
  //if no player create it
  if (!player) {
    if (!message.member.voice.channel) throw "NOT IN A VC"
    player = await client.manager.players.create({
      guildId: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });
    if (player && player.node && !player.node.connected) await player.node.connect()
    player.set("messageid", message.id);
  }
  let state = player.state;
  if (state !== "CONNECTED") {
    //set the variables
    player.set("message", message);
    player.set("playerauthor", message.author.id);
    await player.connect();
    //try{message.react("863876115584385074").catch(() => {});}catch(e){console.log(String(e).grey)}
    //await player.stop();
  }
  try {
    // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
    if (type.split(":")[1] === "youtube" || type.split(":")[1] === "soundcloud"){
      if(isValidURL(search)){
        res = await client.manager.search(search);
      } else {
        res = await client.manager.search({
          query: search,
          source: type.split(":")[1]
        });
      }
    }
    else {
      res = await client.manager.search(search);
    }
    // Check the load type as this command is not that advanced for basics
    if (res.loadType === "LOAD_FAILED") throw res.exception;
    else if (res.loadType === "PLAYLIST_LOADED") {
      playlist_()
    } else {
      song_()
    }
  } catch (e) {
    console.log(e.stack ? e.stack : e)
    if(slashCommand)
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable1"]))
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable2"]))
      ]});
    
      if(slashCommand) 
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable1"]))
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable2"]))
      ]});
    return message.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable1"]))
      .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable2"]))
    ]});
  }

  async function song_() {
    if (!res.tracks[0]){
      if(slashCommand) 
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable3"]))
      ]})
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable3"]))
      ]}).then(msg => {
        setTimeout(()=>{
          msg.delete().catch(() => {})
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (!player.connected) {
      //set the variables
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      //connect
      await player.connect();
      //try{message.react("863876115584385074").catch(() => {});}catch(e){console.log(String(e).grey)}
      //add track
	  await res.tracks[0].setRequester(message.author);
	  //console.log(res.tracks[0]);
      await player.queue.add(res.tracks[0]);
	  console.log("added 1");
      //play track
      //await player.pause(false);
	  //console.log(res.tracks[0]);
    } else if (!player.queue || !player.current) {
      //add track
	  await res.tracks[0].setRequester(message.author);
      await player.queue.add(res.tracks[0]);
	  console.log("added 2");
      //play track
      //await player.pause(false);
    } else {
      //add the latest track
	  res.tracks[0].setRequester(message.author);
      await player.queue.add(res.tracks[0]);
	  console.log("added 3");
      //send track information
      var playembed = new MessageEmbed()
        .setDescription(client.la[ls]["handlers"]["playermanagers"]["song"]["variable4"])
        .setColor(ee.color)
        .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
        .addField("⌛ Duration: ", `\`${res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration)}\``, true)
        .addField("💯 Song By: ", `\`${res.tracks[0].author}\``, true)
        .addField("🔂 Queue length: ", `\`${player.queue.length} Songs\``, true)
      if(slashCommand) slashCommand.reply({ephemeral: true, embeds: [playembed]})
      else message.reply({embeds: [playembed]})
    }
	console.log(!player.playing);
	if (!player.playing) await player.play();
    if(client.musicsettings.get(player.guildId, "channel") && client.musicsettings.get(player.guildId, "channel").length > 5){
      let messageId = client.musicsettings.get(player.guildId, "message");
      let guild = client.guilds.cache.get(player.guildId);
      if(!guild) return 
      let channel = guild.channels.cache.get(client.musicsettings.get(player.guildId, "channel"));
      if(!channel) return 
      let message = channel.messages.cache.get(messageId);
      if(!message) message = await channel.messages.fetch(messageId).catch(()=>{});
      if(!message) return
      //edit the message so that it's right!
      var data = require("../erela_events/musicsystem").generateQueueEmbed(client, player.guildId)
      message.edit(data).catch(() => {})
      if(client.musicsettings.get(player.guildId, "channel") == player.textChannel){
        return;
      }
    }
  }
  //function for playist
  async function playlist_() {
    if (!res.tracks[0]){
      if(slashCommand) 
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable5"]))
      ]})
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["song"]["variable5"]))
      ]}).then(msg => {
        setTimeout(()=>{
          msg.delete().catch(() => {})
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("playerauthor", message.author.id);
      await player.connect();
      //try{message.react("863876115584385074").catch(() => {});}catch(e){console.log(String(e).grey)}
      var firsttrack = res.tracks[0]
      //add track
      if (extras && extras === "songoftheday") {
        await player.queue.add(res.tracks.slice(1, res.tracks.length - 1));
        await player.queue.add(firsttrack);
      } else {
        await player.queue.add(res.tracks);
      }
    } else if (!player.queue || !player.queue.current) {
      var firsttrack = res.tracks[0]
      //add track
      if (extras && extras === "songoftheday") {
        await player.queue.add(res.tracks.slice(1, res.tracks.length - 1));
        await player.queue.add(firsttrack);
      } else {
        await player.queue.add(res.tracks);
      }
      //play track
      await player.play();
      //player.pause(false);
    } else {
      //add the tracks
      await player.queue.add(res.tracks);
    }
    //send information
    var playlistembed = new MessageEmbed()
      .setTitle(`Added Playlist 🩸 **\`${res.playlist.name}`.substring(0, 256 - 3) + "`**")
      .setURL(res.playlist.uri).setColor(ee.color)
      .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
      .addField("⌛ Duration: ", `\`${format(res.playlist.duration)}\``, true)
      .addField("🔂 Queue length: ", `\`${player.queue.length} Songs\``, true)
      .setFooter(client.getFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({
        dynamic: true
      })))
      if(slashCommand) slashCommand.reply({ephemeral: true, embeds: [playlistembed]})
      else message.reply({embeds: [playlistembed]})
    if(client.musicsettings.get(player.guildId, "channel") && client.musicsettings.get(player.guildId, "channel").length > 5){
      let messageId = client.musicsettings.get(player.guildId, "message");
      let guild = client.guilds.cache.get(player.guildId);
      if(!guild) return 
      let channel = guild.channels.cache.get(client.musicsettings.get(player.guildId, "channel"));
      if(!channel) return 
      let message = channel.messages.cache.get(messageId);
      if(!message) message = await channel.messages.fetch(messageId).catch(()=>{});
      if(!message) return
      //edit the message so that it's right!
      var data = require("../erela_events/musicsystem").generateQueueEmbed(client, player.guildId)
      message.edit(data).catch(() => {})
      if(client.musicsettings.get(player.guildId, "channel") == player.textChannel){
        return;
      }
    }
  }

}

module.exports = song;

/**
 * @INFO
 * Bot Coded by paninizer#8583 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Panzer Shipyards Development | https://blucher.panzer-chan.repl.co/
 * @INFO
 * Please mention them / Panzer Shipyards Development, when using this Code!
 * @INFO
 */