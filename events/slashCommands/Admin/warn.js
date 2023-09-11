const {
  MessageEmbed, Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  databasing, dbEnsure
} = require(`../../handlers/functions`);
module.exports = {
  name: `warn`,
  category: `🚫 Administration`,
  cooldown: 0.5,
  description: `Warns a member with a reason`,
  options: [//OPTIONS (OPTIONAL)
	{"String": { name: "id", description: "The ID of the user you want to warn", required: false }}, 
	{"User": { name: "user", description: "The user you want to warn", required: false }},
	{"String": { name: "reason", description: "Reason for warn", required: false }},
  ],

  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {
    
    await interaction?.deferReply();
    
    try {
       const { member, channelId, guildId, applicationId, 
		        commandName, deferred, replied, ephemeral, 
				options, id, createdTimestamp 
		} = interaction; 
		const { guild } = member;

      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.warn || [];
      var cmdrole = []
        if(cmdroles.length > 0){
          for await (const r of cmdroles){
            if(interaction.guild.roles.cache.get(r)){
              cmdrole.push(` | <@&${r}>`)
            }
            else if(interaction.guild.members.cache.get(r)){
              cmdrole.push(` | <@${r}>`)
            }
            else {
              const File = `warn`;
              let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
              if(index > -1) {
                GuildSettings.cmdadminroles[File].splice(index, 1);
                client.settings.set(`${guildId}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
            }
          }
        }

      if (([...member.roles.cache.values()] && !member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(member?.id) && ([...member.roles.cache.values()] && !member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerIDS).includes(member?.id) && !member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
        return interaction?.editReply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable2"]))
        ]});
      let warnmember = options.getMember("user") || interaction.guild.members.cache.get(options.getString("id"));
      if (!warnmember)
        return interaction.editReply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable4"]))
        ]});

      let reason = options.getString("reason")
      if (!reason) {
        reason = `NO REASON`;
      }

      const memberPosition = warnmember.roles.highest.position;
      const moderationPosition = member.roles.highest.position;

      if (moderationPosition <= memberPosition)
        return interaction.editReply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable5"]))
        ]});

      try {

        await dbEnsure(client.userProfiles, member?.id, {
          id: member?.id,
          guild: guildId,
          totalActions: 0,
          warnings: [],
          kicks: []
        });

        await dbEnsure(client.userProfiles, warnmember.id, {
          id: warnmember.id,
          guild: guildId,
          totalActions: 0,
          warnings: [],
          kicks: []
        });

        const newActionId = await client.modActions.stats().then(d => client.getUniqueID(d.count));
        await client.modActions.set(newActionId, {
          user: warnmember.id,
          guild: guildId,
          type: 'warning',
          moderator: member?.id,
          reason: reason,
          when: new Date().toLocaleString(`de`),
          oldhighesrole: member.roles ? member.roles.highest : `Had No Roles`,
          oldthumburl: member?.user.displayAvatarURL({
              dynamic: true
          })
        });
        // Push the action to the user's warnings
        await client.userProfiles.push(warnmember.id + '.warnings', newActionId);
        await client.userProfiles.add(member?.id + '.totalActions', 1);
        await client.stats.push(guildId + member?.id + ".warn", new Date().getTime());
        const warnIDs = await client.userProfiles.get(warnmember.id + '.warnings')
        const modActions = await client.modActions.all();
        const warnData = warnIDs.map(id => modActions.find(d => d.ID == id)?.data);
        let warnings = warnData.filter(v => v.guild == guildId);


        warnmember.send({embeds :[new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(`You have: ${warnings ? warnings.length : 0} Global Warns`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
          
          .setAuthor(client.getAuthor(`You've got warned by: ${member.user.tag}`, member.user.displayAvatarURL({
            dynamic: true
          })))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable6"]))]}).catch(e => console.log(e.message))

        interaction.editReply({embeds :[new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(`They have: ${warnings ? warnData.length : 0} Global Warns`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
          
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable7"]))
          .setThumbnail(warnmember.user.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(`**They now have: ${warnings.length} warnings in ${interaction.guild.name}**`.substring(0, 2048))
        ]});

        let warnsettings = GuildSettings.warnsettings;
        if(warnsettings.kick && warnsettings.kick == warnings.length){
          if (!warnmember.kickable)
            return interaction?.channel.send({embeds :[new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
            ]});
            try{
              warnmember.send({embeds : [new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
              ]});
            } catch{
              return interaction.channel.send({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
              ]});
            }
            try {
              warnmember.kick({
                reason: `Reached ${warnings.length} Warnings`
              }).then(async () => {
                interaction.channel.send({embeds :[new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                  .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                ]});
              });
            } catch (e) {
              console.error(e);
              return interaction.channel.send({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
              ]});
            }
        }
        if(warnsettings.ban && warnsettings.ban == warnings.length){
          if (!warnmember.bannable)
            return interaction.channel.send({embeds : [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
            ]});
            try{
              warnmember.send({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
              ]});
            } catch {
              return interaction.channel.send({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable18"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable19"]))
              ]});
            }
            try {
              warnmember.ban({
                reason: `Reached ${warnings.length} Warnings`
              }).then(async () => {
                interaction.channel.send({embeds :[new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                  .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                ]});
              });
            } catch (e) {
              console.error(e);
              return interaction.channel.send({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
              ]});
            }
        }
        for await (const role of warnsettings.roles){
          if(role.warncount == warnings.length){
            if(!warnmember.roles.cache.has(role.roleid)){
              warnmember.roles.add(role.roleid).catch(() => null)
            }
          }
        }
        if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
          try{
            var channel = interaction.guild.channels.cache.get(GuildSettings.adminlog)
            if(!channel) return client.settings.set(`${guildId}.adminlog`, "no");
            channel.send({embeds : [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
              .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable24"]))
              .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
             .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
              .setTimestamp().setFooter(client.getFooter("ID: " + member?.id, member.user.displayAvatarURL({dynamic: true})))
            ]})
          }catch (e){
            console.error(e)
          }
        } 
        
      } catch (e) {
        console.error(e);
        return interaction.channel.send({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable27"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable28"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return interaction.editReply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable29"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable30"]))
       ]} );
    }
  }
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