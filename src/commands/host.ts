import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteractionOptionResolver,
  TextChannel,
  Guild,
  MessageReaction,
  User,
} from "discord.js";
import { client } from "..";
import ms from "ms";

export const data = new SlashCommandBuilder()

  .setName("host")
  .setDescription("Start Hosting the Hunger Games")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("What channel would you like this message to appear in")
      .setRequired(true)
  )
  .addStringOption((op) =>
    op
      .setName("message")
      .setDescription("What message would you like to appear in the channel")
      .setRequired(true)
  )
  .addStringOption((timer) =>
    timer
      .setName("time")
      .setDescription("How much time before the hunger games begins")
      .setRequired(true)
  )
  .addIntegerOption((playercount) =>
    playercount
      .setName("players")
      .setDescription("How many people will be playing?")
      .setRequired(true)
  )

export async function execute(interaction: CommandInteraction) {
  const info = interaction.options as CommandInteractionOptionResolver;
  const channel = info.getChannel("channel");
  const message = info.getString("message");
  const timer = info.getString("time");
  const playerCount = info.getInteger("playercount");
  const guildId = interaction.guildId;

  const timerrr = ms(timer as string);

  // function nextStage() {
  //   var numberAlive = 5

  //   if numberAlive = 1 {
  //     endGame
  //   } else{
  //     nextRound
  //   }

  //   function nextRound(){
  //     //Next round simulation goes in here
  //   }
  //   function endGame() {
  //     //Game end goes in here
  //   }
  // }
  

  if (guildId) {
    const guild: Guild = client.guilds.cache.get(guildId) as Guild;
    const channell: TextChannel = guild.channels.cache.get(
      channel!.id
    ) as TextChannel;

    const exampleEmbed = new EmbedBuilder()

      .setColor(0x0099ff)
      .setTitle("Hunger games")
      .setDescription(message)
      .setTimestamp()
      .setFooter({
        text: "Hosted by Hunger games bot",
        iconURL: `${client.user?.avatarURL()}`,
      });
    if (message) {
      channell.send({ embeds: [exampleEmbed] }).then((embedMessage) => {
        embedMessage.react("👍");

        const collectorFilter = (reaction: MessageReaction, user: User) => {
          return (
            reaction.emoji.name === "👍" && user.id === embedMessage.author.id
          );
        };

        const collector = embedMessage.createReactionCollector({
          filter: collectorFilter,
          time: timerrr,
        });

        collector.on("end", (collected) => {
          const userIds = collected
            .get("👍")
            ?.users.cache.filter((x) => x.id !== client.application?.id);
          console.log(userIds);

          let str = "";
          userIds?.forEach((x) => (str += `<@${x.id}>   ${x.avatarURL()}\r\n`));
          // channell.send(str);

          function nextDistrict() {
            let strr = "";
            userIds?.forEach((x) => (strr += `<@${x.id}>   ${x.avatarURL()}\r\n`));
            channell.send(strr)
          }
          console.log(`Collected ${collected.size} items`);

          const districtEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("District selection")
            .setDescription("The proceedings are as follows: Dragon")
            .addFields({
              name: "Inline field title",
              value: "Some value here",
              inline: true,
            })
            .setImage("https://cdn.discordapp.com/avatars/262185111955570689/b05061ae6caaf6f5d67fe7b69c4c4862.webp")
            .setFooter({
              text: "Some footer text here",
              iconURL: `${client.user?.avatarURL()}`,
            });

          channell.send({ embeds: [districtEmbed] });
          nextDistrict()
        });
        
      });
    }
  }

  const extraInfo = isNaN(timerrr) ? "" : `The timer is ${timerrr} in ms`;

  return interaction.reply(
    "Done! check your message in " + `<#${channel?.id}>   ${extraInfo}`
  );
}
