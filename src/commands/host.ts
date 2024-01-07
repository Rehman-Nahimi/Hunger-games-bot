import { CommandInteraction, SlashCommandBuilder, Message, EmbedBuilder, MessageReaction, User, CommandInteractionOptionResolver, Channel, TextChannel, Guild } from "discord.js";
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
  );


export async function execute(interaction: CommandInteraction) {
  const info = interaction.options as CommandInteractionOptionResolver;
  const channel = info.getChannel("channel");
  const message= info.getString("message");

  const guildId =interaction.guildId;
  if(guildId){
    const guild: Guild = client.guilds.cache.get(guildId) as Guild;             
    const channell: TextChannel =     guild.channels.cache.get(channel!.id) as TextChannel
    const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Hunger games')
	.setDescription(message)
	.setTimestamp()
	.setFooter({ text: 'Hosted by Hunger games bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
    
    ;
    if(message){

      channell.send({ embeds: [exampleEmbed] });
      }
  }             
  return interaction.reply("Done!");
}


