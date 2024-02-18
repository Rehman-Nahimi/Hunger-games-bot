import {
  CreateDieHTML,
  CreateGameHtml,
  CreateRoundHtml,
  CreateWinnerHTML,
} from "../helpers/Factories/HtmlFactory";
import {
  CheckDeath,
  FilterDistForAlive,
  GetRandomIndex,
  MakeGame,
} from "../helpers/helpFunctions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { TextBasedChannel } from "discord.js";
import {
  GetPictureBuffer,
  GetPictureBufferSingle,
  GetPictureBufferSingleSync,
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

  private delay: number;
  private playing = true;

  constructor(players: Player[], channel: TextBasedChannel) {
    this.roundId = 0;
    this.playersAlive = players.length;
    this.Districts = MakeGame(players).Districts;
    this.Channel = channel;
    this.Rounds = [];
    this.delay = 1_000;
  }

  async PrepareGame(intervalTime = 5000) {
    this.delay = intervalTime;

    //Gets the Strings that need to be converted.
    const str = CreateGameHtml(this.Districts);
    //Gets the Converted Picture buffers
    const buffers = await GetPictureBuffer(str);
    const message = CreateRoundMessage(buffers, this.roundId);
    //Sends the Feedback to the Server.
    await SendMessage(
      this.Channel,
      "----------------------------------------------------" +
        "\r\nThe Players\r\n" +
        "----------------------------------------------------"
    );

    if (
      message.embeds.length !== 0 &&
      message.files.length !== 0 
    ) {
      //Sends the Feedback to the Server.
      await SendMessage(this.Channel, message);
    }

    const round: Round = {
      HadEvent: [],
      DiedInROund: [],
      AliveDistricts: this.Districts,
      RoundNumber: this.roundId,
    };
    this.Rounds.push(round);
    this.roundId++;

    while (this.playing) {
      this.PlayGame(this);
    }
  }
  private async PlayGame(game: GameClass) {
    // Here out the Logic for the game rounds or start it.
    // Another way to check if only one player is Alive.
    if (game.playersAlive > 1) {
      // console.log(
      //   `Playing the game with Instance ${game} ${game.roundId} alive ${game.playersAlive}`
      // );

      game.RoundGenerator();
      // console.log(`after gen round alive ${game.playersAlive}`);

      //Filter the dead players out, so the rest works fine.
      game.Districts = FilterDistForAlive(
        game.Rounds[game.roundId].DiedInROund,
        game.Districts
      );

      //Lets People Die.
      this.LetPlayersDie(game);
      //Filter again afterwards.
      game.Districts = FilterDistForAlive(
        game.Rounds[game.roundId].DiedInROund,
        game.Districts
      );

      // console.log(`Number of Player alive ${game.playersAlive}`);

      game.Rounds[this.roundId].AliveDistricts = game.Districts;

      game.roundId++;
    } else {
      this.playing = false;

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

      game.GameMessagesHandler(game);
    }
  }

  private static async SendRoundMessages(
    channel: TextBasedChannel,
    round: Round,
    livingDistrict: District[],
    id: number
  ) {
    //Gets the Strings that need to be converted.
    const dieHTML = CreateDieHTML(round);
    //Gets the Converted Picture buffers
    const dieBuffer = await GetPictureBuffer(dieHTML);
    const dieMessage = CreateDieMessage(dieBuffer, id);

    if (
      dieMessage.embeds.length !== 0 &&
      dieMessage.files.length !== 0
    ) {
      //Sends the Feedback to the Server.
      SendMessage(channel, dieMessage);
    }

    // //Gets the Strings that need to be converted.
    // const str = CreateGameHtml(livingDistrict);
    // //Gets the Converted Picture buffers
    // const buffers = await GetPictureBuffer(str);
    // const message = CreateRoundMessage(buffers, id);
    // //Sends the Feedback to the Server.
    // SendMessage(
    //   channel,
    //   "----------------------------------------------------"
    // );
    // // game.Channel.send(CreateDieMessage(index + 1));
    // SendMessage(channel, message);
  }

  private LetPlayersDie(game: GameClass) {
    //Goes Trough each District to then look if someone Dies.
    for (let i = 0; i < game.Districts.length; i++) {
      for (let j = 0; j < game.Districts[i].Players.length; j++) {
        if (game.playersAlive > 1) {
          const player = CheckDeath(game.Districts[i].Players[j]);

          if (!player.IsAlive) {
            game.Districts[i].Players[j] = player;
            game.playersAlive -= 1;
            const index = this.CheckDistrict(
              game.Rounds[game.roundId].DiedInROund,
              this.Districts[i]
            );

            game.Rounds[game.roundId].DiedInROund[index].Players.push(player);
          }
        }
      }
    }
  }

  private CheckDistrict(targetDistricts: District[], district: District) {
    if (
      targetDistricts.findIndex((x) => x.DistNumber === district.DistNumber) ===
      -1
    ) {
      targetDistricts.push({ DistNumber: district.DistNumber, Players: [] });
    }

    return targetDistricts.findIndex(
      (x) => x.DistNumber === district.DistNumber
    );
  }

  RoundGenerator() {
    const round: Round = {
      HadEvent: [],
      DiedInROund: [],
      AliveDistricts: [],
      RoundNumber: this.roundId,
    };

    let amountDie = GetRandomIndex(10);
    if (amountDie > 3) {
      amountDie = 0;
    }

    for (let i = 0; i < this.Districts.length; i++) {
      for (let j = 0; j < this.Districts[i].Players.length; j++) {
        const focusedPlayer: Player = {
          Events: [],
          IsAlive: this.Districts[i].Players[j].IsAlive,
          Name: this.Districts[i].Players[j].Name,
          Url: this.Districts[i].Players[j].Url,
          SurvivalRate: this.Districts[i].Players[j].SurvivalRate,
          User: this.Districts[i].Players[j].User
        };

        //Gets the Event to match to.
        const event = randomEnum(Events);

        let index: number;
        switch (event) {
          case Events.Death:
            if (this.playersAlive > 1 && amountDie > 0) {
              focusedPlayer.IsAlive = false;
              focusedPlayer.Events.push(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
              );

              //Push to round thing the player with District
              index = this.CheckDistrict(round.DiedInROund, this.Districts[i]);
              round.DiedInROund[index].Players.push(focusedPlayer);

              this.playersAlive -= 1;
              amountDie -= 1;
            }
            break;
          case Events.Injury:
            focusedPlayer.SurvivalRate -= 0.35;
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round.HadEvent, this.Districts[i]);
            round.HadEvent[index].Players.push(focusedPlayer);
            break;
          case Events.LightInjury:
            focusedPlayer.SurvivalRate -= 0.35;
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round.HadEvent, this.Districts[i]);
            round.HadEvent[index].Players.push(focusedPlayer);
            break;
          case Events.Misc:
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round.HadEvent, this.Districts[i]);
            round.HadEvent[index].Players.push(focusedPlayer);
            break;
          case Events.LightBuff:
            focusedPlayer.SurvivalRate += 0.35;
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round.HadEvent, this.Districts[i]);
            round.HadEvent[index].Players.push(focusedPlayer);
            break;
          case Events.Buff:
            focusedPlayer.SurvivalRate += 0.55;
            focusedPlayer.Events.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              EzMapSzenario.get(event)!.GetScenario(focusedPlayer)
            );
            //Push to round thing the player with District
            index = this.CheckDistrict(round.HadEvent, this.Districts[i]);
            round.HadEvent[index].Players.push(focusedPlayer);
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

  private async GameMessagesHandler(game: GameClass) {
    for (let index = 1; index < game.Rounds.length; index++) {

     await SendMessage(
        this.Channel,
        "----------------------------------------------------" +
          "\r\nNew Round\r\n" +
          "----------------------------------------------------"
      );
      //picture event
      const htmlRound = CreateRoundHtml(game.Rounds[index]);

      for (let i = 0; i < htmlRound.length; i++) {
        const element = htmlRound[i];
        const roundBuffers = (await GetPictureBufferSingleSync(
          element
        )) as Buffer;
        const roundMessage = CreateRoundMessage([roundBuffers], index);
        if (
          roundMessage.embeds.length !== 0 &&
          roundMessage.files.length !== 0 
        ) {
          SendMessage(game.Channel, roundMessage);
        }
        console.log("Sended something ");
        await delay(game.delay);
      }

      // The async Method Call to not block the Thread.
      await GameClass.SendRoundMessages(
        game.Channel,
        game.Rounds[index],
        game.Rounds[index].AliveDistricts,
        index
      );

      console.log("Sended something ");
      await delay(game.delay);
    }

    const winnerHtml = CreateWinnerHTML(game.Districts[0].Players[0]);
    const buffer = await GetPictureBufferSingle(winnerHtml);

    try {
      const message = CreateEndMessage(buffer, game.Districts[0].Players[0].User.id);
      SendMessage(game.Channel, message);
    } catch (error) {
      //Only log error
      console.log(error);
    }
      console.log("Sended something ");
    console.log("Ended Sending");
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
