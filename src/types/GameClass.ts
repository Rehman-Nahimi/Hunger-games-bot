import { CreateGameHtml } from "../helpers/Factories/HtmlFactory";
import { GetRandomIndex, MakeGame } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { TextChannel, flatten } from "discord.js";
import { dummies } from "../helpers/dummyPlayers";
import { GetPictureBuffer } from "../helpers/Factories/PictureFactory";
import {
  CreateDieMessage,
  CreateRoundMessage,
} from "../helpers/Factories/MessageFactory";

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

      // //Gets the Index of the Player/District to Die.
      // const tDIndex = GetRandomIndex(game.Districts.length);

      //Lets People Die.
      GameClass.LetPlayersDie(game);

      // The async Method Call to not block the Thread.
      GameClass.SendRoundMessages(game);

      // //Delete the Player/District from the List.
      // game.Districts.splice(tDIndex, 1);
    } else {
      // Needed to end the Set-Interval (Automated round calls).
      if (game.intervalId !== null) {
        clearTimeout(game.intervalId);
      }

      console.log("🎮 Game Ended !!!!");
    }
  }

  private static async SendRoundMessages(game: GameClass, index = 0) {
    //Gets the Strings that need to be converted.
    const str = CreateGameHtml(game);

    //Gets the Converted Picture buffers
    const buffers = await GetPictureBuffer(str);

    if (game.Channel !== null) {
      const message = CreateRoundMessage(buffers, game.roundId);

      //Sends the Feedback to the Server.
      game.Channel.send("----------------------------------------------------");
      // game.Channel.send(CreateDieMessage(index + 1));
      game.Channel.send(message);
    }
    (game as GameClass).roundId += 1;
  }

  private static LetPlayersDie(game: Game) {
    
    //Goes Trough each District to then look if someone Dies.
    for (let i = 0; i < game.Districts.length; i++) {
      //Decider if theres a person to Die and picks the person.
      const probability = GetRandomIndex(10);
      if (probability < 1) {
        const index = GetRandomIndex(game.Districts[i].Players.length);

        game.Districts[i].Players[index].IsAlive = false;
      }

      //Filters so we get the Amount of Alive people
      const aliveCount = game.Districts[i].Players.filter((x) => {
        x.IsAlive === true;
      }).length;

      //If the alive Count is 0 then we can delete that District.
      if (aliveCount === 0) {
        game.Districts.splice(i, 1);
      }
    }
  }
}

export const TestGame = new GameClass();

