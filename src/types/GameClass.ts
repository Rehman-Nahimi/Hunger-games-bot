import {
  CreateDieHTML,
  CreateGameHtml,
  CreateRoundHtml,
  CreateWinnerHTML,
} from "../helpers/Factories/HtmlFactory";
import { CheckDeath, MakeGame, RoundGenerator } from "../helpers/helpFunctions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { TextBasedChannel } from "discord.js";
import { dummies } from "../helpers/dummyPlayers";
import {
  GetPictureBuffer,
  GetPictureBufferSingle,
} from "../helpers/Factories/PictureFactory";
import {
  CreateDieMessage,
  CreateEndMessage,
  CreateRoundMessage,
} from "../helpers/Factories/MessageFactory";
import { Round } from "./Round";
import { SendMessage } from "../helpers/messageHandler";

export class GameClass implements Game {
  Districts: District[];
  Channel: TextBasedChannel;
  Rounds: Round[];
  public playersAlive;
  public roundId;

  //Placeholder for the Intervall Process Id.
  private intervalId: NodeJS.Timeout | null = null;

  constructor(players: Player[], channel: TextBasedChannel) {
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
    this.Rounds = [];
  }
  /*
    Bereite Spiel vor.
  */
  PrepareGame(intervalTime = 5000) {
    this.intervalId = setInterval(
      function (game) {
        game.PlayGame(game);
      },
      1000,
      this
    );
  }

  private async PlayGame(game: GameClass): Promise<void> {
    // Here out the Logic for the game rounds or start it.
    // Another way to check if only one player is Alive.
    if (this.playersAlive > 1) {
      console.log(`Playing the game with Instance ${game} ${game.roundId}`);

      const playeralivebefore = game.playersAlive;
      console.log(playeralivebefore);
      //picture event
      game.Rounds.push(RoundGenerator(game));
      // const htmlRound = CreateRoundHtml(game);
      // const roundBuffers = await GetPictureBuffer(htmlRound);
      // const roundMessage = CreateRoundMessage(roundBuffers, game.roundId);
      // SendMessage(game.Channel, roundMessage);

      game = GameClass.FilterAlive(game) as GameClass;

      //Lets People Die.
      GameClass.LetPlayersDie(game);

      //picture dies

      const nowalive = game.playersAlive;

      console.log(`Amount that die ${playeralivebefore - nowalive}`);

      // The async Method Call to not block the Thread.
      // await GameClass.SendRoundMessages(game);
    } else {
      // Needed to end the Set-Interval (Automated round calls).
      if (game.intervalId !== null) {
        clearTimeout(game.intervalId);
        game.intervalId = null;
      }
      await GameClass.SendRoundMessages(game);

      const winnerHtml = CreateWinnerHTML(game.Districts[0].Players[0]);
      const buffer = await GetPictureBufferSingle(winnerHtml);

      const message = CreateEndMessage(buffer);
      SendMessage(game.Channel, message);

      for (let I = 0; I < game.Districts.length; I++) {
        const element = game.Districts[I];
        for (let j = 0; j < element.Players.length; j++) {
          const player = element.Players[j];
          console.log(
            `District ${element.DistNumber} player ${player.Name} ${player.IsAlive}`
          );
        }
      }
      console.log("🎮 Game Ended !!!!");
    }
  }

  private static async SendRoundMessages(game: GameClass) {
    //Gets the Strings that need to be converted.
    const dieHTML = CreateDieHTML(game);
    //Gets the Converted Picture buffers
    const dieBuffer = await GetPictureBuffer(dieHTML);
    const dieMessage = CreateDieMessage(dieBuffer, game.roundId);
    //Sends the Feedback to the Server.
    SendMessage(
      game.Channel,
      "----------------------------------------------------"
    );
    SendMessage(game.Channel, dieMessage);

    //Gets the Strings that need to be converted.
    const str = CreateGameHtml(game);
    //Gets the Converted Picture buffers
    const buffers = await GetPictureBuffer(str);
    const message = CreateRoundMessage(buffers, game.roundId);
    //Sends the Feedback to the Server.
    SendMessage(
      game.Channel,
      "----------------------------------------------------"
    );
    // game.Channel.send(CreateDieMessage(index + 1));
    SendMessage(game.Channel, message);
  }

  private static LetPlayersDie(game: Game) {
    //Goes Trough each District to then look if someone Dies.
    game.Rounds.push({ Districts: [], RoundNumber: game.roundId });
    for (let i = 0; i < game.Districts.length; i++) {
      for (let j = 0; j < game.Districts[i].Players.length; j++) {
        if (game.playersAlive > 1) {
          const player = CheckDeath(game.Districts[i].Players[j]);

          if (!player.IsAlive) {
            game.Districts[i].Players[j] = player;
            game.playersAlive -= 1;
          }
        }
      }
    }

    game = GameClass.FilterAlive(game);
    console.log(`Number of Player alive ${game.playersAlive}`);
    game.roundId++;
  }

  private static FilterAlive(game: Game) {
    for (let i = 0; i < game.Districts.length; i++) {
      const players = game.Districts[i].Players.filter((x) => !x.IsAlive);
      if (players.length > 0) {
        game.Rounds[game.roundId].Districts.push({
          DistNumber: game.Districts[i].DistNumber,
          Players: players,
        });

        for (let index = 0; index < players.length; index++) {
          const delIndex = game.Districts[i].Players.indexOf(players[index]);

          if (delIndex !== -1) {
            game.Districts[i].Players.splice(delIndex, 1);
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
    return game;
  }
}

