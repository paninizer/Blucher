const Discord = require("discord.js");


module.exports = {
  name: "tankfacts",
  aliases: ["tf", "tanks"],
  category: "🔰 Info",
  description: "Get information about various tanks!",
  usage: "tankfacts",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    const startingEmbed = {
      color: "#4d5d53",
      title: "Tank Facts",
      description: "Please choose a nation to explore facts more in-depth!",
      author: message.author,
      thumbnail: message.author.avatarURL({ dynamic: true }),
      fields: [ 
        {
          name: "America",
          value: "As the world's industrial superpower, America has reliable and robust tanks that have great maneuverability and lower-than-average survivability. The later versions changed into jacks-of-all-trades that are decent in everything."
        },
        {
          name: "China",
          value: "China once used imported tanks against the enemies, but it created some of its own designs as well. Lots of its tanks are captured or modified to provide more available parts or tanks. As a result of such, a lot of the tanks are quite different in terms of performance, even if they appear the same. China's own designs feature decent mobility, firepower, and turret armour, but their hull armor and internal modules are rather weak."
        },
        {
          name: "France",
          value: "The French started out their tanks with the best armor, low mobility, and very underwheming guns, but that quickly changed into tanks with great firepower, mobility, but extremely low armour and protection. They have an unique invention that's called drum loader. It differs from Italy's autoloader because it has to load a whole magazine in order to shoot, while Italy only has to load 1 out of a magazine."
        },    
        {
          name: "Germany",
          value: "Germany was the first to use tanks en-masse. Their tank designs offer a wide variety of choices, from behemoths weighing 188 tons to small recon vehicles of no more than 10 tons. What distinguished them from their opponents are the unusually high survivability on the heavies and raw firepower on the tank destroyers."
        },
        {
          name: "Great Britain",
          value: "The inventors of the first tanks and a fully mobile army, Britain incoporates cavalry into mechanization, having fast-moving tanks with fast-firing guns. They evolved into slower, more powerful tanks with great survivability and extreme firepower. Later tanks sometimes feature a shell type that's brand new: HESH, or high explosive squash head. It impacts against something, spreading out explosives onto the surface, before they detonate. It's particularly effective against tanks, as HESH disregards armour angle and distance, while creating spall that can seriously damage modules or injure crew. As to increase clarity, all tanks developed by the Commonwealth are under Britain."
        },
        {
          name: "Italy",
          value: "Italy is a latestarter in the mechanized race, but it catches up extremely quickly. The earlier versions are, admittedly, cheap copies of German tanks, but the later versions incoporate a new concept: autoloader. Autoloaders allow quick firing of magazines and quick reloading."
        },
        {
          name: "Japan",
          value: "Japan features gigantic heavies that are even larger than the German ones, with tremendous firepower. The mediums are lights feature good speeds with decent guns."
        },
        {
          name: "USSR",
          value: "This nation has endured lots of terrors, so it's keen to produce many weapons to defend itself and to wage wars. Its tanks are all around decent, with lots of firepower and armour, while maintaining maneuverability and ease of production."
        }      
      ],
      timestamp: new Date(),
    }
  
    const selectrow = new Discord.MessageActionRow().addComponents([
      new Discord.MessageSelectMenu()
        .setCustomId('t_select_nation')
        .setPlaceholder('Select One: ')
        .addOptions([
          {
            label: "America",
            description: "Shows American Tank List",
            value: "america",
          },
          {
            label: "China",
            description: "Shows Chinese Tank List",
            value: "china",
          },
          {
            label: "France",
            description: "Shows French Tank List",
            value: "france",
          },
          {
            label: "Germany",
            description: "Shows German Tank List",
            value: "germany",
          },
          {
            label: "Great Britain",
            description: "Shows British Tank List",
            value: "britain",
          },
          {
            label: "Italy",
            description: "Shows Italian Tank List",
            value: "italy",
          },
          {
            label: "Japan",
            description: "Shows Japanese Tank List",
            value: "japan",
          },
          {
            label: "USSR",
            description: "Shows Soviet Tank List",
            value: "ussr",
          },
        ])
    ])
    const d_selectrow = new Discord.MessageActionRow().addComponents([
      new Discord.MessageSelectMenu()
        .setCustomId('t_select_nation_d')
        .setPlaceholder('Disabled')
        .addOptions([
          {
            label: "America",
            description: "Shows American Tank List",
            value: "america",
          },
          {
            label: "China",
            description: "Shows Chinese Tank List",
            value: "china",
          },
          {
            label: "France",
            description: "Shows French Tank List",
            value: "france",
          },
          {
            label: "Germany",
            description: "Shows German Tank List",
            value: "germany",
          },
          {
            label: "Great Britain",
            description: "Shows British Tank List",
            value: "britain",
          },
          {
            label: "Italy",
            description: "Shows Italian Tank List",
            value: "italy",
          },
          {
            label: "Japan",
            description: "Shows Japanese Tank List",
            value: "japan",
          },
          {
            label: "USSR",
            description: "Shows Soviet Tank List",
            value: "ussr",
          },
        ])
        .setDisabled(true)
    ])
    const btnrow = new Discord.MessageActionRow().addComponents([
      new Discord.MessageButton().setCustomId("home").setStyle("SUCCESS").setLabel("Home"),
      new Discord.MessageButton().setCustomId("type_s").setStyle("PRIMARY").setLabel("Search By Type"),
      new Discord.MessageButton().setCustomId("nation_s").setStyle("PRIMARY").setLabel("Search By Nation"),
      new Discord.MessageButton().setCustomId("alpha_s").setStyle("PRIMARY").setLabel("Search By Alphabetical Order"),
    ]);
    const d_btnrow = new Discord.MessageActionRow().addComponents([
      new Discord.MessageButton().setCustomId("d_home").setStyle("SUCCESS").setLabel("Home").setDisabled(true),
      new Discord.MessageButton().setCustomId("d_type_s").setStyle("PRIMARY").setLabel("Search By Type").setDisabled(true),
      new Discord.MessageButton().setCustomId("d_nation_s").setStyle("PRIMARY").setLabel("Search By Nation").setDisabled(true),
      new Discord.MessageButton().setCustomId("d_alpha_s").setStyle("PRIMARY").setLabel("Search By Alphabetical Order").setDisabled(true),
    ]);
    
    await message.reply({embeds: [startingEmbed], components: [selectrow, btnrow]}).then(async (msg) => {
      let filter = i => i.user.id === message.author.id;
      let collector = await msg.createMessageComponentCollector({filter: filter, time: 1000 * 60 * 7.5})
      collector.on('collect', async (interaction) => {
        await interaction.deferUpdate().catch(e => {
          console.log(e);
        });
        if (interaction.isSelectMenu()) {
          if (interaction.customId === "t_select_nation") {
  
            const tanklist = await client.tanks.filter(tanks => tanks.nation==interaction.values[0]);
            const embed = {
              title: `Tanks List`,
              description: `>>> \`${tanklist.map(tanks => tanks.name).join(", ")}\``
            }
            await msg.edit({embeds: [embed]});
          }
        }
        else if (interaction.isButton()) {
          if (interaction.customId==="type_s") {
            await msg.edit({components: [d_btnrow, d_selectrow]});
            const typeembed = {
              title: "Listed By Types",
              description: "Tanks are classified by different types, classified by weight, armour, and gun. There are generally 6 types: ",
              fields: [
                {
                  name: "Light Tanks",
                  value: "Light tanks are designed to be very maneuverable, so that it can engage in reconnaissance missions and outmaneuver the enemies. They don't have much in the way of armour or firepower.",
                  inline: true,
                },
                {
                  name: "Medium Tanks",
                  value: "Mediums are allaround fighters that compromises the supreme maneuverability of light tanks with the armour and firepower of heavy tanks. They are mainly used to exploit weaknesses in enemy defenses.",
                  inline: true,
                },
                {
                  name: "Heavy Tanks",
                  value: "Heavies are all armour and firepower. They can take tremendous amounts of punishment and return raw firepower. They are mainly used to tank fire while pushing forwards, limiting casualties for infantry and others. Both medium and heavy tanks are replaced by the Main Battle Tank after WWII.",
                  inline: true,
                },
                {
                  name: "Tank Destroyers",
                  value: "Tank destroyers have unmatched firepower, but in return gives up armour and, in lots of cases, maneuverability, making them vulnerable if they are spotted. They have only one task: destroy as many enemy tanks as possible.",
                  inline: true,
                },
                {
                  name: "Self Propelled Gun (SPG)",
                  value: "Self propelled guns are indirect support vehicles that rain shells upon the enemy. They come equipped with a howitzer that can either destroy tanks or to support infantry against other infantry or damaging buildings. They don't have protection against enemy fire, though.",
                  inline: true,
                },
                {
                  name: "Superheavy Tanks",
                  value: "Tanks so heavy that they aren't useful anymore, except as decoration in a museum. Most of them were made as a breakthrough weapon, able to withstand even more damage than heavies. Some of them have 200-300mm of armour!",
                  inline: true,
                },
                {
                  name: "Main Battle Tanks",
                  value: "A main battle tank (MBT), also known as a battle tank or universal tank, is a tank that fills the armor-protected direct fire and maneuver role of many modern armies. Cold War-era development of more powerful engines, better suspension systems and lighter-weight composite armor allowed the design of a tank that had the firepower of a super-heavy tank, the armor protection of a heavy tank, and the mobility of a light tank, in a package with the weight of a medium tank. Through the 1960s, the MBT replaced almost all other types of tanks, leaving only some specialist roles to be filled by lighter designs or other types of armored fighting vehicles.",
                  inline: false,
                },
              ],
              thumbnail: {
                url: message.guild.iconURL({dynamic: true}),
              },
              footer: {
                text: `Use \"${prefix}help\" to view help!`,
              },
              timestamp: new Date(),
            }
            const light = new Discord.MessageSelectMenu().setCustomId("light").setPlaceholder("Light Tanks");
            const d_light = new Discord.MessageSelectMenu().setCustomId("d_light").setPlaceholder("Disabled").setDisabled(true);
            client.tanks.filter(tanks => tanks.type==="light").forEach((tank) => {
              light.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
              d_light.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
            });
            const medium = new Discord.MessageSelectMenu().setCustomId("medium").setPlaceholder("Medium Tanks");
            const d_medium = new Discord.MessageSelectMenu().setCustomId("d_medium").setPlaceholder("Disabled").setDisabled(true);
            await client.tanks.filter(tanks => tanks.type==="medium").forEach((tank) => {
              medium.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
              d_medium.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
            });
            const heavy = new Discord.MessageSelectMenu().setCustomId("heavy").setPlaceholder("Heavy Tanks");
            const d_heavy = new Discord.MessageSelectMenu().setCustomId("d_heavy").setPlaceholder("Disabled").setDisabled(true);
            await client.tanks.filter(tanks => tanks.type==="heavy").forEach((tank) => {
              heavy.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
              d_heavy.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
            });
            const td = new Discord.MessageSelectMenu().setCustomId("td").setPlaceholder("Tank Destroyers");
            const d_td = new Discord.MessageSelectMenu().setCustomId("d_td").setPlaceholder("Disabled").setDisabled(true);
            await client.tanks.filter(tanks => tanks.type==="td").forEach((tank) => {
              td.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
              d_td.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
            });
            const spg = new Discord.MessageSelectMenu().setCustomId("spg").setPlaceholder("Self-Propelled Guns");
            const d_spg = new Discord.MessageSelectMenu().setCustomId("d_spg").setPlaceholder("Disabled").setDisabled(true);
            await client.tanks.filter(tanks => tanks.type==="spg").forEach((tank) => {
              spg.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
              d_spg.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
            });
            const sh = new Discord.MessageSelectMenu().setCustomId("superheavy").setPlaceholder("Super-Heavy Tanks");
            const d_sh = new Discord.MessageSelectMenu().setCustomId("d_superheavy").setPlaceholder("Disabled").setDisabled(true);
            await client.tanks.filter(tanks => tanks.type==="superheavy").forEach((tank) => {
              sh.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
              d_sh.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
            });
            const mbt = new Discord.MessageSelectMenu().setCustomId("mbt").setPlaceholder("Main Battle Tanks");
            const d_mbt = new Discord.MessageSelectMenu().setCustomId("d_mbt").setPlaceholder("Disabled").setDisabled(true);
            await client.tanks.filter(tanks => tanks.type==="mbt").forEach((tank) => {
              mbt.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
              d_mbt.addOptions([{label: tank.name, description: `Shows Info for ${tank.name}`, value: tank.name}])
            });
            
            let lightselect = new Discord.MessageActionRow().addComponents([
              light
            ]);
            let mediumselect = new Discord.MessageActionRow().addComponents([
              medium
            ]);
            let heavyselect = new Discord.MessageActionRow().addComponents([
              heavy
            ]);
            let tdselect = new Discord.MessageActionRow().addComponents([
              td
            ]);
            let spgselect = new Discord.MessageActionRow().addComponents([
              spg
            ]);
            let shselect = new Discord.MessageActionRow().addComponents([
              sh
            ]);
            let mbtselect = new Discord.MessageActionRow().addComponents([
              mbt
            ]);
            let d_lightselect = new Discord.MessageActionRow().addComponents([
              d_light
            ]);
            let d_mediumselect = new Discord.MessageActionRow().addComponents([
              d_medium
            ]);
            let d_heavyselect = new Discord.MessageActionRow().addComponents([
              d_heavy
            ]);
            let d_tdselect = new Discord.MessageActionRow().addComponents([
              d_td
            ]);
            let d_spgselect = new Discord.MessageActionRow().addComponents([
              d_spg
            ]);
            let d_shselect = new Discord.MessageActionRow().addComponents([
              d_sh
            ]);
            let d_mbtselect = new Discord.MessageActionRow().addComponents([
              d_mbt
            ]);
            
            const firstmsg = await message.channel.send({embeds: [typeembed], components: [lightselect, mediumselect, heavyselect, tdselect, spgselect]});
            const secondmsg = await message.channel.send({components: [shselect, mbtselect]});
            let filter = i => i.user.id === message.author.id;
            let t_collect = await message.channel.createMessageComponentCollector({filter: filter, time: 1000 * 60 * 5})
            t_collect.on('collect', async (interact) => {
              if (interact.isSelectMenu()) {
                if (interact.customId==="light"||
                    interact.customId==="medium"||
                    interact.customId==="heavy"||                 
                    interact.customId==="spg"||
                    interact.customId==="td"||
                    interact.customId==="superheavy"||
                    interact.customId==="mbt") {
                  await interact.deferUpdate().catch(e => {
                    console.log(e);
                  })
                  let value = await client.tanks.get(interact.values[0]);
                  if (!value) return message.channel.send("An error has occured!");
                  const TankEmbed = {
                    title: value.name,
                    description: value.description,
                    fields: [
                      {
                        name: "Armament(s)",
                        value: value.armaments,
                      },
                      {
                        name: "Armour",
                        value: value.armour,
                      },
                    ],
                    image: {
                      url: value.image,
                    },
                    footer: {
                      text: value.footer,
                      iconurl: value.iconURL,
                    },
                    color: "#4d5d53"
                  }
                  await firstmsg.edit({embeds: [TankEmbed]});                
                }
              }
            })
            t_collect.on('end', async () => {
              await firstmsg.edit({components: [d_lightselect, d_mediumselect, d_heavyselect, d_tdselect, d_spgselect]});
              await secondmsg.edit({components: [d_shselect, d_mbtselect]});
              await firstmsg.edit({content: "Interaction Timed Out! Please use the command again if you want to start a new process!"});
            })
          }
          else if (interaction.customId==="nation_s") {
            const nationEmbed = {
              title: "Search By Nation",
              description: "***Coming Soon!***",
              image: {
                url: "https://c.tenor.com/_C6ijUhjvdMAAAAC/nyan-hellcat.gif",
              }
            }
            await msg.edit({embeds: [nationEmbed]});
          }
          else if (interaction.customId==="alpha_s") {
            const alphaEmbed = {
              title: "Search By Alphabetical Order",
              description: "***Coming Soon!***",
              image: {
                url: "https://c.tenor.com/UjhP1EjamzYAAAAC/nyan-nyantank.gif",
              }
            }
            await msg.edit({embeds: [alphaEmbed]});
          }
          else if (interaction.customId==="home") msg.edit({embeds: [startingEmbed]});
        }
      });
      collector.on('end', async () => {
        await msg.edit({components: [d_selectrow, d_btnrow]});
        await msg.edit({content: "Interaction Timed Out! Please use the command again if you want to start a new process!"});
      });
    });    
  }
}