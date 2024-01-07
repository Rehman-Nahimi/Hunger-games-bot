import { CommandInteraction, SlashCommandBuilder, Message, EmbedBuilder, MessageReaction, User } from "discord.js";

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
  return interaction.reply("Hello World!");
}


