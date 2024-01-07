import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Says Hello!");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Hello World!");
}
