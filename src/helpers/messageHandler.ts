import {
  MessageCreateOptions,
  MessagePayload, TextBasedChannel,
} from "discord.js";

export async function  SendMessage(
  channel: TextBasedChannel,
  content: string | MessagePayload | MessageCreateOptions
) {
  await channel.send(content);
}
