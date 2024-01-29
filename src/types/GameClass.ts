import nodeHtmlToImage from "node-html-to-image";
import { CreateGameHtml } from "../helpers/HtmlFactory";
import { MakeGameV2 } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { AttachmentBuilder, EmbedBuilder, TextChannel } from "discord.js";
import { channel } from "diagnostics_channel";

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
    //Here out the Logic for the game rounds or start it.
    if (game.Districts.length > 0) {
      const str = CreateGameHtml(game);
      for (let i = 0; i < str.length; i++) {
        async () => {
          const image = await nodeHtmlToImage({
            html: str[i],
          });

          const test = image as Buffer;

          console.log("This is the then", test);
          if (game.Channel !== null) {
            const file = new AttachmentBuilder(test);
            const exampleEmbed = new EmbedBuilder()
              .setTitle("Some title")
              .setImage("attachment://discordjs.png");

            game.Channel.send({ embeds: [exampleEmbed], files: [file] });
          }
        };
      }
    } else {
      //Needed to end the Set-Interval (Automated round calls).
      if (game.intervalId !== null) {
        clearTimeout(game.intervalId);
      }

      console.log("its finished");
    }
  }
}

export const TestGame = new GameClass();
