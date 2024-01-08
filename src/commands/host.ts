import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteractionOptionResolver,
  TextChannel,
  Guild,
  Client,
  Events,
  GatewayIntentBits,
  ReactionEmoji,
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
  );

export async function execute(interaction: CommandInteraction) {
  const info = interaction.options as CommandInteractionOptionResolver;
  const channel = info.getChannel("channel");
  const message = info.getString("message");
  const timer = info.getString("time");
  const guildId = interaction.guildId;

  const timerrr = ms(timer as string);

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
          return reaction.emoji.name === '👍' && user.id === embedMessage.author.id;
      };

      
        //Awaiting reactions
  embedMessage.awaitReactions( { filter:collectorFilter, time: timerrr }).then(collected => console.log(collected.size))
  .catch(collected => {
      console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
  })
      });
    }
    
  }


  const extraInfo = isNaN(timerrr) ? "" : `The timer is ${timerrr} in ms`;
  
  return interaction.reply(
    "Done! check your message in " + `<#${channel?.id}>   ${extraInfo}`
  );

    
  
}



