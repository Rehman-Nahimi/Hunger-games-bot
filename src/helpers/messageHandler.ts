import {
  MessageCreateOptions,
  MessagePayload,
  TextBasedChannel,
} from "discord.js";

export function SendMessage(
  channel: TextBasedChannel,
  content: string | MessagePayload | MessageCreateOptions
) {
  channel.send(content);
}
