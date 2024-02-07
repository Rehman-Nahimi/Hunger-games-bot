import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteractionOptionResolver,
  TextChannel,
  Guild,
  MessageReaction,
} from "discord.js";
import { client } from "..";
import ms from "ms";
import { Player } from "../types/Player";
import { GameClass } from "../types/GameClass";

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
  .addIntegerOption((playerCount) =>
    playerCount
      .setName("players")
      .setDescription("How many people will be playing?")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const info = interaction.options as CommandInteractionOptionResolver;
  const channel = info.getChannel("channel");
  const message = info.getString("message");
  const timer = info.getString("time");
  const playerCount = info.getInteger("players");
  const guildId = interaction.guildId;

  const numbTime = ms(timer as string);

  if (guildId) {
    const guild: Guild = client.guilds.cache.get(guildId) as Guild;
    let targetChannel: TextChannel;

    if (channel !== null) {
      targetChannel = guild.channels.cache.get(channel.id) as TextChannel;
    } else {
      targetChannel = interaction.channel as TextChannel;
    }

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Hunger games")
      .setDescription(message)
      .setTimestamp()
      .setFooter({
        text: "Hosted by Hunger games bot",
        iconURL: `${client.user?.avatarURL()}`,
      });

    if (message && targetChannel && playerCount) {
      CollectUsers(targetChannel, exampleEmbed, numbTime, playerCount);
    }
  }
  return interaction.reply({
    content: `Done! The message should appear after ${timer} ms in <#${channel?.id}> `,
    ephemeral: true,
  });
}

async function CollectUsers(
  channel: TextChannel,
  embedMessage: EmbedBuilder,
  timer: number,
  playerCount: number
) {
  channel.send({ embeds: [embedMessage] }).then((embedMessage) => {
    embedMessage.react("👍");

    const collectorFilter = (reaction: MessageReaction) => {
      return reaction.emoji.name == "👍";
    };

    const collector = embedMessage.createReactionCollector({
      filter: collectorFilter,
      time: timer,
      maxUsers: playerCount + 1,
    });

    collector.on("end", (collected) => {
      const userIds = collected
        .get("👍")
        ?.users.cache.filter((x) => x.id !== client.application?.id);

      //Create the Players from the
      const players: Player[] = [];
      userIds?.forEach((x) => {
        const urlStr = x.avatarURL();

        players.push({
          IsAlive: true,
          Name: x.username,
          Url: urlStr !== null ? urlStr : "",
          Events: [],
        });
      });
      channel.send("The Collection ended");

      const myGame = new GameClass();
      myGame.PrepareGame(players, channel, 5000);
    });
  });
}
