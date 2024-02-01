import { CreateGameHtml } from "../helpers/Factories/HtmlFactory";
import { GetRandomIndex, MakeGame } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { TextChannel } from "discord.js";
import { dummies } from "../helpers/dummyPlayers";
import { GetPictureBuffer } from "../helpers/Factories/PictureFactory";
import { CreateDieMessage, CreateRoundMessage } from "../helpers/Factories/MessageFactory";

class GameClass implements Game {
  Districts: District[] = [];
  Channel: TextChannel | null = null;

  private roundId = 0;

  //Placeholder for the Intervall Process Id.
  private intervalId: NodeJS.Timeout | null = null;

  /*
    Bereite Spiel vor.
  */
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
      console.log(`Playing the game with Instance ${game}`);

      //Gets the Index of the Player/District to Die.
      const tDIndex =GetRandomIndex(game.Districts.length); 

      // The async Method Call to not block the Thread.
      GameClass.SendRoundMessages(game,tDIndex);

      //Delete the Player/District from the List.
      game.Districts.splice(tDIndex, 1);
    } else {
      // Needed to end the Set-Interval (Automated round calls).
      if (game.intervalId !== null) {
        clearTimeout(game.intervalId);
      }

      console.log("🎮 Game Ended !!!!");
    }
  }

  private static async SendRoundMessages(game: GameClass, index: number) {
    const str = CreateGameHtml(game);
    const buffers = await GetPictureBuffer(str);

    if (game.Channel !== null ) {
      const message = CreateRoundMessage(buffers, game.roundId);

      game.Channel.send("----------------------------------------------------");
      game.Channel.send(CreateDieMessage(index+1));
      game.Channel.send(message);
    }
    (game as GameClass).roundId += 1;
  }
}

export const TestGame = new GameClass();
