import {
  CreateDieHTML,
  CreateGameHtml,
} from "../helpers/Factories/HtmlFactory";
import { GetRandomIndex, MakeGame } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { TextBasedChannel } from "discord.js";
import { dummies } from "../helpers/dummyPlayers";
import { GetPictureBuffer } from "../helpers/Factories/PictureFactory";
import {
  CreateDieMessage,
  CreateRoundMessage,
} from "../helpers/Factories/MessageFactory";
import { deathScenario, miscScenario } from "../helpers/eventArrays";
import { Round } from "./Round";
import { SendMessage } from "../helpers/messageHandler";

export class GameClass implements Game {
  Districts: District[];
  Channel: TextBasedChannel ;
  Rounds: Round[];
  private playersAlive;
  public roundId;

  //Placeholder for the Intervall Process Id.
  private intervalId: NodeJS.Timeout | null = null;

  constructor(players: Player[], channel: TextBasedChannel){
    const playDumm: Player[] = [];

    dummies.forEach((element) => {
      playDumm.push({
        Events: [],
        IsAlive: element.IsAlive,
        Name: element.Name,
        Url: element.Url,
        SurvivalRate: 1,
      });
    });

    this.roundId = 0;
    this.playersAlive = playDumm.length;
    this.Districts = MakeGame(playDumm).Districts;
    this.Channel = channel;
    this. Rounds = []; 
  }
  /*
    Bereite Spiel vor.
  */
  PrepareGame(intervalTime = 5000) {
    this.intervalId = setInterval(
      function (game) {
        game.PlayGame(game);
      },
      intervalTime,
      this
    );
  }

  private async PlayGame(game: GameClass): Promise<void> {
    // Here out the Logic for the game rounds or start it.
    // Another way to check if only one player is Alive.
    if (this.playersAlive > 1) {
      console.log(`Playing the game with Instance ${game} ${game.roundId}`);

      // //Gets the Index of the Player/District to Die.
      // const tDIndex = GetRandomIndex(game.Districts.length);

      for (let I = 0; I < game.Districts.length; I++) {
        const element = game.Districts[I];
        for (let j = 0; j < element.Players.length; j++) {
          const player = element.Players[j];
          player.Events.push(miscScenario.GetScenario(player));
        }
      }

      //picture event

      //Lets People Die.
      GameClass.LetPlayersDie(game);

      //picture dies

      // The async Method Call to not block the Thread.
      await GameClass.SendRoundMessages(game);

      // //Delete the Player/District from the List.
      // game.Districts.splice(tDIndex, 1);
    } else {
      // Needed to end the Set-Interval (Automated round calls).
      if (game.intervalId !== null) {
        clearTimeout(game.intervalId);
        game.intervalId = null; 
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
      SendMessage(game.Channel, "----------------------------------------------------");
      // game.Channel.send(CreateDieMessage(index + 1));
      SendMessage(game.Channel, message);

      
      //Sends the Feedback to the Server.
      SendMessage(game.Channel, "----------------------------------------------------");

      //Gets the Strings that need to be converted.
      const dieHTML = CreateDieHTML(game);

      //Gets the Converted Picture buffers
      const dieBuffer = await GetPictureBuffer(dieHTML);
      const dieMessage = CreateDieMessage(dieBuffer);

      SendMessage(game.Channel, dieMessage);
    }
  }

  private static LetPlayersDie(game: Game) {
    //Goes Trough each District to then look if someone Dies.
    const gamooo = game as GameClass;
    game.Rounds.push({ Districts: [], RounNumber: gamooo.roundId });
    for (let i = 0; i < game.Districts.length; i++) {
      //Decider if theres a person to Die and picks the person.
      const probability = GetRandomIndex(10);
      if (probability < 4 && gamooo.playersAlive > 1) {
        const index = GetRandomIndex(game.Districts[i].Players.length);

        if (game.Districts[i].Players.length !== 0) {
          game.Districts[i].Players[index].IsAlive = false;
          game.Districts[i].Players[index].Events.push(
            deathScenario.GetScenario(game.Districts[i].Players[index])
          );
        }
      }
    }

    for (let i = 0; i < game.Districts.length; i++) {
      const players = game.Districts[i].Players.filter((x) => !x.IsAlive);
      if (players.length > 0) {
        game.Rounds[gamooo.roundId].Districts.push({
          DistNumber: game.Districts[i].DistNumber,
          Players: players,
        });

        for (let index = 0; index < players.length; index++) {
          const delIndex = game.Districts[i].Players.indexOf(players[index]);

          if (delIndex !== -1) {
            game.Districts[i].Players.splice(delIndex, 1);
            gamooo.playersAlive = gamooo.playersAlive - 1;
          }
        }
      }
      //Filters so we get the Amount of Alive people
      const aliveCount = game.Districts[i].Players.filter(
        (x) => x.IsAlive == true
      ).length;

      //If the alive Count is 0 then we can delete that District.
      if (aliveCount === 0) {
        game.Districts.splice(i, 1);
      }
    }

    console.log(`Number of Player alive${gamooo.playersAlive}`);
    gamooo.roundId++;
  }
}
