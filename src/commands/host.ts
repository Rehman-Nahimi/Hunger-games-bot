import { CommandInteraction, SlashCommandBuilder, Message, EmbedBuilder, MessageReaction, User, CommandInteractionOptionResolver, Channel, TextChannel, Guild, Events, GatewayIntentBits } from "discord.js";
import { client } from "..";

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
  .addIntegerOption((timer) =>
  timer 
  .setName("time")
  .setDescription("How much time before the hunger games begins")
  .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const info = interaction.options as CommandInteractionOptionResolver;
  const channel = info.getChannel("channel");
  const message = info.getString("message");
  const timer = info.getInteger("time");
  const guildId = interaction.guildId;
  if(guildId){
    const guild: Guild = client.guilds.cache.get(guildId) as Guild;             
    const channell: TextChannel =     guild.channels.cache.get(channel!.id) as TextChannel
    const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Hunger games')
	.setDescription(message)
	.setTimestamp()
	.setFooter({ text: 'Hosted by Hunger games bot', iconURL: `${client.user?.avatarURL()}` })
    ;
    if(message){
      channell.send({ embeds: [exampleEmbed] }).then(embedMessage => {
        embedMessage.react("👍");
      });
      }
  }             
  return interaction.reply("Done! check your message in " + `<#${channel?.id}>`);
}


