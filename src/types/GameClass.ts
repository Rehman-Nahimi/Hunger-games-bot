import nodeHtmlToImage from "node-html-to-image";
import { CreateGameHtml } from "../helpers/HtmlFactory";
import { MakeGameV2 } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { AttachmentBuilder, EmbedBuilder, TextChannel } from "discord.js";

class GameClass implements Game {
  Districts: District[] = [];
  Channel: TextChannel | null = null;

  //Placeholder for the Intervall Process Id.
  private intervalId: NodeJS.Timeout | null = null;

  PrepareGame(players: Player[], channel: TextChannel, intervalTime = 5000) {
    this.Districts = MakeGameV2(players).Districts;
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
    for (let i = 0; i < str.length; i++) {
      const image = await nodeHtmlToImage({
        html: str[i],
      });
      const imageBuffer = image as Buffer;

      if (game.Channel !== null) {
        const exampleEmbed = new EmbedBuilder()
          .setTitle("Some title")
          .setColor(0x0099ff);

        const myAttachment = new AttachmentBuilder(imageBuffer, {
          name: "GameBuffer.png",
        });
        exampleEmbed.setImage(`attachment://${myAttachment.name}`);
        game.Channel.send({
          content: "Game Image",
          embeds: [exampleEmbed],
          files: [myAttachment],
        });
      }
    }
  }
}

export const TestGame = new GameClass();
