var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure,
  edit_msg,
  send_roster,
  dbRemove
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-customcommand",
  category: "💪 Setup",
  aliases: ["setupcustomcommand","setupcustomcommands", "customcommand-setup", "setup-customcommands"],
  cooldown: 5,
  usage: "setup-customcommand  --> Follow the Steps",
  description: "Define Custom Commands, Create Custom Commands and Remove Custom Commands --> \"Custom Command Names, that sends Custom Messages\"",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    try {
      var originalowner = message.author?.id;
      let timeouterror;
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        let menuoptions = [{
            value: "Create Custom Command",
            description: `Create a Custom Command of your Choice`,
            emoji: "✅"
          },
          {
            value: "Delete Custom Command",
            description: `Delete one of the Custom Command(s)`,
            emoji: "❌"
          },
          {
            value: "Show Settings",
            description: `Show the all Custom Commands!`,
            emoji: "📑"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Automated Embed System!') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
              value: option.value.substring(0, 50),
              description: option.description.substring(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor(client.getAuthor('Custom Command Setup', 'https://images-ext-1.discordapp.net/external/HF-XNy3iUP4D95zv2fuTUy1csYWuNa5IZj2HSCSkvhs/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'Bara no Kōtei'))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})

        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.disableComponentMessage(menu);
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `<a:animated_wrong:947340139359789106> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:947339988780064859> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){ // return message.reply
          case "Create Custom Command": {
            if(await client.customcommands.get(message.guild.id +".commands").length > 24)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable5"]))
                .setColor(es.wrongcolor)
                .setDescription(`You cannot have more then **25** Custom Commands`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable6"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable7"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 120000,
                errors: ["time"]
              })
            .then(async collected => {
              var msg = collected.first().content.split(" ")[0];
              if (msg) {
                  var thecustomcommand = {
                    name: msg,
                    output: "ye",
                    embeds: false,
                  }
                tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable8"]))
                  .setColor(es.color)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable9"]))
                  .setFooter(client.getFooter(es))
                ]})
                await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                    max: 1,
                    time: 120000,
                    errors: ["time"]
                  })
                  .then(async collected => {
                    var msg = collected.first().content;
                    if (msg) {
                        thecustomcommand.output = msg;
                        var ttempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable10"]))
                          .setColor(es.color)
                          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable11"]))
                          .setFooter(client.getFooter(es))
                        ]})
                        try{
                          ttempmsg.react("✅")
                          ttempmsg.react("❌")
                        }catch{

                        }
                        await ttempmsg.awaitReactions({ filter: (reaction, user) => user == originalowner, 
                            max: 1,
                            time: 90000,
                            errors: ["time"]
                          })
                          .then(async collected => {
                            var reaction = collected.first();
                            if (reaction) {
                              if(reaction.emoji?.name == "✅") {
                                thecustomcommand.embed = true;
                              } else {
                                thecustomcommand.embed = false;
                              }
                              await client.customcommands.push(message.guild.id+".commands", thecustomcommand)

                              message.reply({embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable12"]))
                                .setColor(es.color)
                                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable13"]))
                                .setFooter(client.getFooter(es))
                              ]})

                              if(reaction.emoji?.name == "✅") {
                                message.reply({embeds: [new Discord.MessageEmbed()
                                  .setColor(es.color)
                                  .setDescription(thecustomcommand.output)
                                  .setFooter(client.getFooter(es))
                                ]})
                              } else {
                                message.reply(thecustomcommand.output)
                              }
                              
                
                            } else {
                              throw "you didn't ping a valid Channel"
                            }
                          })
                          .catch(e => {
                            console.error(e)
                            timeouterror = e;
                          })
                        if (timeouterror)
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable14"]))
                            .setColor(es.wrongcolor)
                            .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                            .setFooter(client.getFooter(es))
                          ]});

                    } else {
                      throw "you didn't ping a valid Channel"
                    }
                  })
                  .catch(e => {
                    console.error(e)
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable15"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});


              } else {
                throw "you didn't ping a valid Channel"
              }
            })
            .catch(e => {
              console.error(e)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable16"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            })
          } break;
          case "Delete Custom Command": {
            let cuc = await client.customcommands.get(message.guild.id +".commands");
            if(!cuc || cuc.length < 1) return message.reply(":x: There are no Custom Commands")
            let menuoptions = [
            ]
            cuc.forEach((cc, index)=>{
              menuoptions.push({
                value: `${cc.name}`.substring(0, 25),
                description: `Delete ${cc.name} ${cc.embed ? "[✅ Embed]" : "[❌ Embed]"}`.substring(0, 50),
                emoji: NumberEmojiIds[index + 1]
              })
            })
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection') 
              .setMaxValues(cuc.length) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Select all Custom Commands which should get deleted') 
              .addOptions(
              menuoptions.map(option => {
                let Obj = {
                  label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                  value: option.value.substring(0, 50),
                  description: option.description.substring(0, 50),
                }
              if(option.emoji) Obj.emoji = option.emoji;
              return Obj;
             }))
            
            //define the embed
            let MenuEmbed = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor('Custom Command Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'Bara no Kōtei')
            .setDescription(`**Select all \`Custom Commands\` which should get __deleted__**`)
            //send the menu msg
            let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({ 
              filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
              time: 90000
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                for await (const value of menu?.values){
                  await dbRemove(client.customcommands, message.guild.id+".commands", d => String(d.name).substring(0, 25).toLowerCase() == String(value).toLowerCase())
                }
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Deleted ${menu?.values.length} Custom Commands!`)
                  .setDescription(`There are now \`${cuc.length - menu?.values.length} Custom Commands\` left!`)
                  .setColor(es.color)
                  .setFooter(client.getFooter(es))
                ]});
              }
              else menu?.reply({content: `<a:animated_wrong:947340139359789106> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:947339988780064859> **Selected: \`${collected.first().values.length} Commands\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
            });
          } break;
          case "Show Settings": {
            let cuc = await client.customcommands.get(message.guild.id +".commands");
            var embed = new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            var embed2 = new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            var sendembed2 = false;
            for (let i = 0; i < cuc.length; i++){
              try{
                var string = `${cuc[i].output}`;
                if(string.length > 250) string = string.substring(0, 250) + " ..."
                if(i > 13){
                  sendembed2 = true;
                  embed2.addField(`<:arrow:832598861813776394> \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> "+ string)
                } else 
                embed.addField(`<:arrow:832598861813776394> \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> "+ string)
              }catch (e){
                console.error(e)
              }
            }
            if(sendembed2)
              await message.reply({embeds: [embed, embed2]})
            else
              await message.reply({embeds: [embed]})
          } break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
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