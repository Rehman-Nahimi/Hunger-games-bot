import { CommandInteraction, SlashCommandBuilder, Message, EmbedBuilder, MessageReaction, User, CommandInteractionOptionResolver, Channel, TextChannel } from "discord.js";
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

  const channell: TextChannel = client.channels.cache.get(channel) as TextChannel;                
  channell.send(message.)
  return interaction.reply("Done!");
}


