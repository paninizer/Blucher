var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, dbRemove
} = require(`../../handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-ticket",
  category: "💪 Setup",
  aliases: ["setupticket", "ticket-setup", "ticketsetup", "ticketsystem"],
  cooldown: 5,
  usage: "setup-ticket --> Follow Steps",
  description: "Manage 100 Ticket Systems, Ticket-Roles, messages, create/disable",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      let temptype = 0;
      let errored = false;
      let guildid = message.guild.id;
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer() {

        let menuoptions = []
        for (let i = 1; i <= 100; i++) {
          menuoptions.push({
            value: `${i} Ticket System`,
            description: `Manage/Edit the ${i} Ticket Setup`,
            emoji: NumberEmojiIds[i]
          })
        }
        
        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Ticket System!')
          .addOptions(
            menuoptions.slice(0, 25).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row2 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection2')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Ticket System!')
          .addOptions(
            menuoptions.slice(25, 50).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row3 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection3')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Ticket System!')
          .addOptions(
            menuoptions.slice(50, 75).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row4 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection4')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Ticket System!')
          .addOptions(
            menuoptions.slice(75, 100).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        

        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png', 'Bara no Kōtei'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [row1, row2, row3, row4]
        })
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          client.disableComponentMessage(menu);
          let SetupNumber = menu?.values[0].split(" ")[0]
          used1 = true;
          second_layer(SetupNumber, menuoptiondata)
        }
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menuselection(menu)
          } else menu?.reply({
            content: `<a:animated_wrong:947340139359789106> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `<a:yes:947339988780064859> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}`
          })
        });
      }
      async function second_layer(SetupNumber, menuoptiondata) {
        let menuoptions = [{
          value: "Create Ticket-System",
          description: `Create/Overwrite the ${SetupNumber} Ticket System`,
          emoji: "⚙️"
        },
        {
          value: "Edit Message",
          description: `Edit the Message when a Ticket opens`,
          emoji: "🛠"
        },
        {
          value: "Add Ticket Role",
          description: `Add a Ticket Role for managing the Tickets`,
          emoji: "😎"
        },
        {
          value: "Remove Ticket Role",
          description: `Remove a Ticket Role from managing the Tickets`,
          emoji: "💩"
        },
        {
          value: "Ticket Category",
          description: `Define the Category where the Tickets are located`,
          emoji: "🔘"
        },
        {
          value: "Ticket Claim System",
          description: `Manage the Claim System for this Ticket System.`,
          emoji: "✅"
        },
        {
          value: "Log Channel",
          description: `Define a Channel for Ticket Logs!`,
          emoji: "📃"
        },
        {
          value: "Set Default Ticket Name",
          description: `Define a Default Ticket Channel Name!`,
          emoji: "💬"
        },
        {
          value: "Delete & Reset",
          description: `Delete current setup, which allows you to resetup`,
          emoji: "🗑"
        },
        {
          value: "Closed Ticket Category",
          description: `When Closing a Ticket, it will be moved to there`,
          emoji: "✂️"
        },
        {
          value: "Cancel",
          description: `Cancel and stop the Ticket-Setup!`,
          emoji: "862306766338523166"
        }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder(`Click me to manage the ${SetupNumber} Ticket System!\n\n**You've picked:**\n> ${menuoptiondata.value}`)
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))

        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor(SetupNumber + " Ticket Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "Bara no Kōtei"))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //function to handle the menuselection
        async function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
          client.disableComponentMessage(menu);
          var ticket = await client.setups.get(message.guild.id+`.ticketsystem${SetupNumber}`);
          handle_the_picks(menu?.values[0], SetupNumber, ticket)
        }
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menuselection(menu)
          } else menu?.reply({
            content: `<a:animated_wrong:947340139359789106> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `<a:yes:947339988780064859> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}`
          })
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, ticket) {

        switch (optionhandletype) {
          case "Closed Ticket Category": {
            let parentId = await client.setups.get(message.guild.id+`.ticketsystem${SetupNumber}.closedParent`);
            let parent = parentId ? message.guild.channels.cache.get(parentId) : null;
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("What should be the new Closed Ticket Category?")
              .setDescription(`Currently it's: \`${parentId ? "Not Setupped yet" : parent ? parent.name : `Channel not Found: ${parentId}`}\`!\nWhen closing a Ticket, it will be moved to there until it get's deleted!\n> **Send the new __PARENT ID__ now!**`)
            message.reply({
              embeds: [rembed]
            }).then(async (msg) => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(async collected => {
                let content = collected.first().content;
                if (!content || content.length > 19 || content.length < 17) {
                  return message.reply("An Id is between 17 and 19 characters big")
                }
                parent = message.guild.channels.cache.get(content);
                if(!parent) {
                  return message.reply(`There is no parent i can access in this Guild which has the ID ${content}`);
                }
                if(parent.type !== "GUILD_CATEGORY"){
                  return message.reply(`<#${parent.id}> is not a CATEGORY/PARENT`);
                }
                await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.closedParent`, parent.id);
                message.reply(`I will now move closed Tickets to ${parent.name} (${parent.id})`);
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          } break;
          case "Set Default Ticket Name": {
            let defaultname = await client.setups.get(message.guild.id+`.ticketsystem${SetupNumber}.defaultname`);
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("What should be the new Default Ticket Name?")
              .setDescription(`Currently it's: \`${defaultname}\` aka it will turn into: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\`\n> \`{member}\` ... will get replaced with the ticket opening username\n> \`{count}\` ... Will get replaced with the TICKET ID (COUNT)\n**Send the Message now!**`)
            message.reply({
              embeds: [rembed]
            }).then(async (msg) => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(async collected => {
                let content = collected.first().content;
                if (!content || !content.includes("{member}")) {
                  return message.reply("You need to have {member} somewhere")
                }
                if (!content || content.length > 32) {
                  return message.reply("A Channelname can't be longer then 32 Characters")
                }
                defaultname = content;
                await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.defaultname`, defaultname);
                message.reply(`Set the Default Ticket Name to: \`${defaultname}\` aka it will turn into: \`${defaultname.replace("{member}", message.author.username).replace("{count}", 0)}\``)
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
          } break;
          case "Create Ticket-System":

            var msg11 = new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable6"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable7"]))
              .setFooter(client.getFooter(es))
              .setColor(es.color)
            message.reply({
              embeds: [msg11]
            }).then(mm => {
              mm.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser,
                max: 1,
                time: 180000,
                errors: ['time'],
              }).then(async collected => {
                let channel = collected.first().mentions.channels?.filter(ch => ch.guild.id == mm.guild.id)?.first()
                if (!channel) return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable8"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
                var msg6 = new MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable9"]))
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable10"]))
                  .setFooter(client.getFooter(es))
                  .setColor(es.color)
                message.reply({
                  embeds: [msg6]
                }).then(async (msg) => {
                  msg.channel.awaitMessages({
                    filter: m => m.author.id == cmduser,
                    max: 1,
                    time: 180000,
                    errors: ['time'],
                  }).then(async collected => {
                    //parent id in db
                    if (channel.parent && channel.parent.id) await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.parentid`, channel.parent.id);

                    ticketmsg = collected.first().content;

                    //channel id in db
                    await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.channelid`, channel.id);

                    let button_open = new MessageActionRow().addComponents([new MessageButton().setStyle('SUCCESS').setCustomId('create_a_ticket').setLabel('Create a Ticket').setEmoji("📨")])

                    channel.send({
                      embeds: [new MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable11"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable12"]))
                        .setFooter(client.getFooter(es))
                        .setColor(es.color)
                      ],
                      components: [button_open]
                    }).then(async (msg) => {
                      //message id in db
                      await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.messageid`, msg.id);
                      await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.enabled`, true);
                      //msg.react(emoji2react)
                      var themebd = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable13"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable14"]))
                        .setFooter(client.getFooter(es))

                      message.reply({
                        embeds: [themebd]
                      })

                    })
                  }).catch(error => {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable15"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  })
                })
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable16"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })




            break;
          case "Delete & Reset":
            try {
              var channel = message.guild.channels.cache.get(ticket.channelid)
              channel.delete();
            } catch { }
            try {
              var parent = message.guild.channels.cache.get(ticket.parentid)
              parent.delete();
            } catch { }
            message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable17"]))
            await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}`, {
              enabled: true,
              guildid: message.guild.id,
              messageid: "",
              channelid: "",
              parentid: "",
              claim: {
                enabled: false,
                messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
              },
              message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
              adminroles: []
            });
            break;
          case "Edit Message":
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable18"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable19"]))
            message.reply({
              embeds: [rembed]
            }).then(async (msg) => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(async collected => {
                message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable20"]))
                await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.message`, collected.first().content);

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Add Ticket Role":
            var rrembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter("Pick the INDEX NUMBER", es.footericon))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable22"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable23"]))
            message.reply({
              embeds: [rrembed]
            }).then(async (msg) => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(async collected => {
                var role = collected.first().mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (!role) message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable24"]))

                message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable25"]));
                await client.setups.push(message.guild.id+`.ticketsystem${SetupNumber}.adminroles`, role.id);

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable26"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Remove Ticket Role":
            var rrrembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter("Pick the INDEX NUMBER", es.footericon))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable27"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable28"]))
            message.reply({
              embeds: [rrrembed]
            }).then(async (msg) => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(async collected => {
                var role = collected.first().mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (!role) message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable29"]))
                try {
                  await dbRemove(client.setups, message.guild.id+`.ticketsystem${SetupNumber}.adminroles`, role.id);
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable30"]));
                } catch {
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable31"]))
                  await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.adminroles`, []);
                }
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable32"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Ticket Category":
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))

              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable33"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable34"]))
            message.reply({
              embeds: [rembed]
            }).then(async (msg) => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(async collected => {
                if (collected.first().content.length == 18) {
                  try {
                    var cat = message.guild.channels.cache.get(collected.first().content)
                    message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable35"]))
                    await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.parentid`, cat.id);
                  } catch {
                    message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable36"]))
                  }
                } else {
                  message.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable37"]))
                }

              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable38"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;
          case "Ticket Claim System": {
            /*
            claim: {
              enabled: false,
              messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
              messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
            },
            */
            let claimData = await client.setups.get(message.guild.id+`.ticketsystem${SetupNumber}.claim`);
            third_layer(SetupNumber)
            async function third_layer(SetupNumber) {
              let menuoptions = [{
                value: `${claimData.enabled ? "Disable Claim System" : "Enable Claim System"}`,
                description: `${claimData.enabled ? "No need to claim the Tickets anymore" : "Make it so that Staff needs to claim the Ticket"}`,
                emoji: `${claimData.enabled ? "❌" : "✅"}`
              },
              {
                value: "Edit Open Message",
                description: `Edit the Claim-Info-Message when a Ticket opens`,
                emoji: "🛠"
              },
              {
                value: "Edit Claim Message",
                description: `Edit the Claim-Message when a Staff claims it!`,
                emoji: "😎"
              },
              {
                value: "Cancel",
                description: `Cancel and stop the Ticket-Setup!`,
                emoji: "862306766338523166"
              }
              ]
              //define the selection
              let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder(`Click me to manage the ${SetupNumber} Ticket System!\n\n**You've picked:**\n> Ticket Claim System`)
                .addOptions(
                  menuoptions.map(option => {
                    let Obj = {
                      label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                      value: option.value.substring(0, 50),
                      description: option.description.substring(0, 50),
                    }
                    if (option.emoji) Obj.emoji = option.emoji;
                    return Obj;
                  }))

              //define the embed
              let MenuEmbed = new Discord.MessageEmbed()
                .setColor(es.color)
                .setAuthor(SetupNumber + " Ticket Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/incoming-envelope_1f4e8.png", "Bara no Kōtei")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
              //send the menu msg
              let menumsg = await message.reply({
                embeds: [MenuEmbed],
                components: [new MessageActionRow().addComponents(Selection)]
              })
              //function to handle the menuselection
              async function menuselection(menu) {
                let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
                client.disableComponentMessage(menu);
                var ticket = await client.setups.get(message.guild.id+`.ticketsystem${SetupNumber}`);
                handle_the_picks2(menu?.values[0], SetupNumber, ticket)
              }
              //Create the collector
              const collector = menumsg.createMessageComponentCollector({
                filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
                time: 90000
              })
              //Menu Collections
              collector.on('collect', async menu => {
                if (menu?.user.id === cmduser.id) {
                  collector.stop();
                  let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                  if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                  menuselection(menu)
                } else menu?.reply({
                  content: `<a:animated_wrong:947340139359789106> You are not allowed to do that! Only: <@${cmduser.id}>`,
                  ephemeral: true
                });
              });
              //Once the Collections ended edit the menu message
              collector.on('end', collected => {
                menumsg.edit({
                  embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                  components: [],
                  content: `${collected && collected.first() && collected.first().values ? `<a:yes:947339988780064859> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}`
                })
              });
            }
            async function handle_the_picks2(optionhandletype, SetupNumber) {

              switch (optionhandletype) {
                case `${claimData.enabled ? "Disable Claim System" : "Enable Claim System"}`: {
                  await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.claim.enabled`, !claimData.enabled);
                  claimData = await client.setups.get(message.guild.id+`.ticketsystem${SetupNumber}.claim`);
                  return message.reply({
                    embeds: [
                      new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setFooter(client.getFooter(es))
                        .setTitle(`${claimData.enabled ? "Enabled the Claim System" : "Disabled the Claim System"}`)
                        .setDescription(`${claimData.enabled ? "When a User opens a Ticket, a Staff Member needs to claim it, before he can send something in there!\n> This is useful for Professionality and Information!\n> **NOTE:** Admins can always chat..." : "You now don't need to claim a Ticket anymore"}`)
                    ]
                  });
                } break;
                case "Edit Open Message": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a User opens a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n\n**Current Message:**\n>>> " + claimData.messageOpen.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(async (msg) => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author?.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(async collected => {
                      await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.claim.messageOpen`, collected.first().content);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
                case "Edit Claim Message": {
                  var rembed = new MessageEmbed()
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                    .setTitle("What should be the new Message when a Staff claims a Ticket?")
                    .setDescription(String("{user} will be replaced with a USERPING\n{claimer} will be replaced with a PING for WHO CLAIMED IT\n\n**Current Message:**\n>>> " + claimData.messageClaim.substring(0, 1900)))
                  message.reply({
                    embeds: [rembed]
                  }).then(async (msg) => {
                    msg.channel.awaitMessages({
                      filter: m => m.author.id === message.author?.id,
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    }).then(async collected => {
                      await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.claim.messageClaim`, collected.first().content);
                      message.reply(`Successfully set the New Message!`)
                    }).catch(error => {
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })
                  })
                } break;
              }
            }
          } break;
          case "Log Channel":
            //ticketlogid
            var rembed = new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("In What Channel do you want to send Logs of this Ticket-System (When a Ticket gets DELETED)")
              .setDescription(`Ping the Channel / send \`no\` for disabeling Logs!\n\n*The Log will only be sent if the ticket gets __DELETED__ via the BUTTON (not the closing)*`)
            message.reply({
              embeds: [rembed]
            }).then(async (msg) => {
              msg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(async collected => {
                let channel = collected.first().mentions.channels.first();
                if (channel) {
                  await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.ticketlogid`, channel.id);
                  message.reply(`Successfully set the <#${channel.id}> as the TICKET-LOG for ${SetupNumber ? SetupNumber : 1}. Ticketsystem`);
                } else {
                  await client.setups.set(message.guild.id+`.ticketsystem${SetupNumber}.ticketlogid`, "");
                  message.reply(":x: Disabled the Log, because you did not send a valid channel")
                }
              }).catch(error => {
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable38"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
            })
            break;

          default:
            message.reply(String("SORRY, that Number does not exists :(\n Your Input:\n> " + collected.first().content).substring(0, 1999))
            break;
        }
      }




    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable39"]))
        ]
      });
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