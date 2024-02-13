import {
  CreateDieHTML,
  CreateGameHtml,
  CreateRoundHtml,
  CreateWinnerHTML,
} from "../helpers/Factories/HtmlFactory";
import { CheckDeath, FilterDistForDead, GetRandomIndex, MakeGame } from "../helpers/helpFunctions";
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
import { Events, EzMapSzenario, randomEnum } from "./EventEnum";

export class GameClass implements Game {
  Districts: District[];
  Channel: TextBasedChannel;
  Rounds: Round[];
  public playersAlive;
  public roundId;
  isplaying = false; 
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
  // PrepareGame(intervalTime = 5000) {
  //   this.intervalId = setInterval(
  //     function (game) {
  //       game.PlayGame(game);
  //     },
  //     1000,
  //     this
  //   );
  // }

  async PrepareGame(intervalTime = 5000) {
    this.isplaying = true;

    console.log("im prepare"); 
    while (this.isplaying) {

      this.PlayGame(this);
    }
  }

  private  PlayGame(game: GameClass){
    // Here out the Logic for the game rounds or start it.
    // Another way to check if only one player is Alive.
    if (game.playersAlive > 1) {
      console.log(`Playing the game with Instance ${game} ${game.roundId}`);
      //picture event
      // game.Rounds.push(
      game.RoundGenerator();
      // );
      // const htmlRound = CreateRoundHtml(game);
      // const roundBuffers = await GetPictureBuffer(htmlRound);
      // const roundMessage = CeateRoundMessage(roundBuffers, game.roundId);
      // SendMessage(game.Channel, roundMessage);

      game.Districts = FilterDistForDead(game.Districts);
      //Lets People Die.
      // GameClass.LetPlayersDie(game);

      //picture dies

      // The async Method Call to not block the Thread.
      // await GameClass.SendRoundMessages(game);
    } else {
      game.FilterAlive();

      // Needed to end the Set-Interval (Automated round calls).
      if (game.intervalId !== null) {
        clearTimeout(game.intervalId);
        game.intervalId = null;
      }
      // const winnerHtml = CreateWinnerHTML(game.Districts[0].Players[0]);
      // const buffer = await GetPictureBufferSingle(winnerHtml);

      // const message = CreateEndMessage(buffer);
      // SendMessage(game.Channel, message);

      console.log("🎮 Game Ended !!!!");

      for (let I = 0; I < game.Districts.length; I++) {
        const element = game.Districts[I];
        for (let j = 0; j < element.Players.length; j++) {
          const player = element.Players[j];
          console.log(
            `District ${element.DistNumber} player ${player.Name} ${player.IsAlive}`
          );
        }
      }
      game.isplaying = false; 
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

  private LetPlayersDie(game: GameClass) {
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

    this.FilterAlive();
    console.log(`Number of Player alive ${game.playersAlive}`);
    game.roundId++;
  }

  private CheckDistrict(round: Round, district: District) {
    if (
      round.Districts.findIndex((x) => x.DistNumber === district.DistNumber) ===
      -1
    ) {
      round.Districts.push({ DistNumber: district.DistNumber, Players: [] });
    }

    return round.Districts.findIndex(
      (x) => x.DistNumber === district.DistNumber
    );
  }

  private FilterAlive() {
    this.Rounds.push({ Districts: [], RoundNumber: this.roundId });

    for (let i = 0; i < this.Districts.length; i++) {
      // const players = game.Districts[i].Players.filter((x) => x.IsAlive !== true);

      const playersManual: Player[] = [];
      for (let index = 0; index < this.Districts[i].Players.length; index++) {
        const element = this.Districts[i].Players[index];
        if (element.IsAlive !== true) {
          playersManual.push(element);
        }
      }

      for (let index = 0; index < playersManual.length; index++) {
        const element = playersManual[index];
        console.log(`The player ${element.Name} and ${element.IsAlive}`);
      }

      if (playersManual.length > 0) {
        this.Rounds[this.roundId].Districts.push({
          DistNumber: this.Districts[i].DistNumber,
          Players: playersManual,
        });

        for (let index = 0; index < playersManual.length; index++) {
          const delIndex = this.Districts[i].Players.indexOf(
            playersManual[index]
          );

          if (delIndex !== -1) {
            this.Districts[i].Players.splice(delIndex, 1);
          }
        }
      }
      //Filters so we get the Amount of Alive people
      const aliveCount = this.Districts[i].Players.filter(
        (x) => x.IsAlive === true
      ).length;

      //If the alive Count is 0 then we can delete that District.
      if (aliveCount === 0) {
        this.Districts.splice(i, 1);
      }
    }

    console.log(this.playersAlive);

    for (let I = 0; I < this.Districts.length; I++) {
      const element = this.Districts[I];
      for (let j = 0; j < element.Players.length; j++) {
        const player = element.Players[j];
        console.log(
          `District ${element.DistNumber} player ${player.Name} ${player.IsAlive}`
        );
      }
    }
  }

  RoundGenerator() {
    const round: Round = {
      Districts: [],
      RoundNumber: this.roundId,
    };

    let amountDie = GetRandomIndex(10);
    if (amountDie > 3) {
      amountDie = 0;
    }

    for (let i = 0; i < this.Districts.length; i++) {
      for (let j = 0; j < this.Districts[i].Players.length; j++) {
        const focusedPlayer = this.Districts[i].Players[j];

        //Gets the Event to match to.
        const event = randomEnum(Events);

        let index: number;
        switch (event) {
          case Events.Death:
            if (this.playersAlive > 1 && amountDie > 0) {
              focusedPlayer.IsAlive = false;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              focusedPlayer.Events.push(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
              );

              //Push to round thing the player with District
              index = this.CheckDistrict(round, this.Districts[i]);
              round.Districts[index].Players.push(focusedPlayer);

              this.playersAlive -= 1;
              amountDie -= 1;
              console.log("someone died");
            }
            break;
          case Events.Injury:
            focusedPlayer.SurvivalRate -= 0.35;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round, this.Districts[i]);
            round.Districts[index].Players.push(focusedPlayer);
            break;
          case Events.LightInjury:
            focusedPlayer.SurvivalRate -= 0.35;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round, this.Districts[i]);
            round.Districts[index].Players.push(focusedPlayer);
            break;
          case Events.Misc:
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round, this.Districts[i]);
            round.Districts[index].Players.push(focusedPlayer);
            break;
          case Events.LightBuff:
            focusedPlayer.SurvivalRate += 0.35;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round, this.Districts[i]);
            round.Districts[index].Players.push(focusedPlayer);
            break;
          case Events.Buff:
            focusedPlayer.SurvivalRate += 0.55;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round, this.Districts[i]);
            round.Districts[index].Players.push(focusedPlayer);
            break;
          case Events.NoEvent:
          //break to default no event
          // eslint-disable-next-line no-fallthrough
          default:
            //Do nothing;
            break;
        }
      }
    }

    //Create the Images for the Round after this, so after this Method gets called.
    //Check Death we will do somewhere else, so we can get the pics first and such.

    this.Rounds.push(round);
  }
}

