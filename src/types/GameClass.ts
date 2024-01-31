import nodeHtmlToImage from "node-html-to-image";
import { CreateGameHtml } from "../helpers/HtmlFactory";
import { MakeGame } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { AttachmentBuilder, EmbedBuilder, TextChannel } from "discord.js";
import { dummies } from "../helpers/dummyPlayers";

class GameClass implements Game {
  Districts: District[] = [];
  Channel: TextChannel | null = null;

  private roundId = 0;

  //Placeholder for the Intervall Process Id.
  private intervalId: NodeJS.Timeout | null = null;

  PrepareGame(players: Player[], channel: TextChannel, intervalTime = 5000) {
    this.Districts = MakeGame(dummies).Districts;
    this.Channel = channel;
    this.intervalId = setInterval(
      function (game) {
        game.PlayGame(game);
      },
      intervalTime,
      this
    );
  }

  private PlayGame(game: GameClass): void {
    // Here out the Logic for the game rounds or start it.
    // Another way to check if only one player is Alive.
    if (game.Districts.length > 0) {
      console.log(`Heres the game ${game}`);

      // The async Method Call to not block the Thread.
      GameClass.SendImage(game);

      game.Districts.splice(0, 1);
    } else {
      // Needed to end the Set-Interval (Automated round calls).
      if (game.intervalId !== null) {
        clearTimeout(game.intervalId);
      }

      console.log("its finished");
    }
  }

  private static async SendImage(game: Game) {
    const str = CreateGameHtml(game);

    if (game.Channel !== null) {
      const exampleEmbeds: EmbedBuilder[] = new Array<EmbedBuilder>(str.length);
      const myAttachments: AttachmentBuilder[] = new Array<AttachmentBuilder>(
        str.length
      );

      for (let i = 0; i < str.length; i++) {
        const image = await nodeHtmlToImage({
          html: str[i],
        });
        const imageBuffer = image as Buffer;

        const exampleEmbed = new EmbedBuilder()
          .setTitle(`Round ${(game as GameClass).roundId}`)
          .setColor(0x0099ff);

        const myAttachment = new AttachmentBuilder(imageBuffer, {
          name: `GameBuffer_${i}.png`,
        });

        exampleEmbed.setImage(`attachment://${myAttachment.name}`);

        //push to the array examplesEmbeds
        exampleEmbeds[i] = exampleEmbed;
        //push to the array myAttachments
        myAttachments[i] = myAttachment;
      }
      game.Channel.send({
        content: "Game Image",
        embeds: exampleEmbeds,
        files: myAttachments,
      });

      (game as GameClass).roundId +=1;
    }
  }
}

export const TestGame = new GameClass();