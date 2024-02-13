import { District } from "../types/District";
import { Events, EzMapSzenario, randomEnum } from "../types/EventEnum";
import { Game } from "../types/Game";
import { Player } from "../types/Player";
import { Round } from "../types/Round";
import { slowDeathScenario } from "./eventArrays";
import { NewPlayerMap } from "./playerMap";

export function MakeGame(totalPlayers: Player[]): Game {
  const game: Game = {
    Districts: [],
    Channel: null,
    Rounds: [],
    playersAlive: totalPlayers.length,
    roundId: 0, 
  };

  //Equation for the player per District
  const playerPerGroup = NewPlayerMap.FindCorrespondingValue(
    new NewPlayerMap(),
    totalPlayers.length
  );

  //Extra counter for logic needed
  let x = 0;

  while (totalPlayers.length > 0) {
    if (game.Districts[x] === undefined) {
      game.Districts.push({ DistNumber: x + 1, Players: [] });
    }

    if (game.Districts[x].Players.length < playerPerGroup) {
      const index = Math.floor(Math.random() * totalPlayers.length);
      const playerAtIndex = totalPlayers.at(index);

      if (playerAtIndex !== undefined) {
        game.Districts[x].Players.push(playerAtIndex);

        const index = totalPlayers.indexOf(playerAtIndex, 0);
        if (index > -1) {
          totalPlayers.splice(index, 1);
        }
      }
    } else {
      x++;
    }
  }

  return game;
}

export function GetRandomIndex(maxNumber: number) {
  return Math.floor(Math.random() * maxNumber);
}

export function FilterDistForDead(districts: District[]) {
  const result: District[] = [];

  for (let I = 0; I < districts.length; I++) {
    const element = districts[I];

    result.push({
      DistNumber: element.DistNumber,
      Players: element.Players.filter((x) => x.IsAlive !== true),
    });
  }
  return result;
}

// We gonna use this somewhere else the warning will go away
export function CheckDeath(player: Player) {
  const dieIndex = GetRandomIndex(100) * player.SurvivalRate;

  if (dieIndex < 20) {
    player.Events.push(slowDeathScenario.GetScenario(player));
    player.IsAlive = false;
  }
  return player;
}

export function RoundGenerator(game: Game): Round {
  const round: Round = {
    Districts: [],
    RoundNumber: game.roundId,
  };

  let amountDie = GetRandomIndex(10);
  if (amountDie > 3) {
    amountDie = 0;
  }

  for (let i = 0; i < game.Districts.length; i++) {
    for (let j = 0; j < game.Districts[i].Players.length; j++) {
      const element = game.Districts[i].Players[j];

      const event = randomEnum(Events);
      let index: number;
      switch (event) {
        case Events.Death:
          if (game.playersAlive > 1 && amountDie > 0) {
            element.IsAlive = false;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            element.Events.push(EzMapSzenario.get(event)!.GetScenario(element));
            //Push to round thing the player with District
            index = CheckDistrict(round, game.Districts[i]);
            round.Districts[index].Players.push(element);
            game.playersAlive -= 1;
            amountDie -= 1;
          }
          break;
        case Events.Injury:
          element.SurvivalRate -= 0.35;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          element.Events.push(EzMapSzenario.get(event)!.GetScenario(element));
          //Push to round thing the player with District
          index = CheckDistrict(round, game.Districts[i]);
          round.Districts[index].Players.push(element);
          break;
        case Events.LightInjury:
          element.SurvivalRate -= 0.35;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          element.Events.push(EzMapSzenario.get(event)!.GetScenario(element));
          //Push to round thing the player with District
          index = CheckDistrict(round, game.Districts[i]);
          round.Districts[index].Players.push(element);
          break;
        case Events.Misc:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          element.Events.push(EzMapSzenario.get(event)!.GetScenario(element));
          //Push to round thing the player with District
          index = CheckDistrict(round, game.Districts[i]);
          round.Districts[index].Players.push(element);
          break;
        case Events.LightBuff:
          element.SurvivalRate += 0.35;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          element.Events.push(EzMapSzenario.get(event)!.GetScenario(element));
          //Push to round thing the player with District
          index = CheckDistrict(round, game.Districts[i]);
          round.Districts[index].Players.push(element);
          break;
        case Events.Buff:
          element.SurvivalRate += 0.55;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          element.Events.push(EzMapSzenario.get(event)!.GetScenario(element));
          //Push to round thing the player with District
          index = CheckDistrict(round, game.Districts[i]);
          round.Districts[index].Players.push(element);
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
  return round;
}

function CheckDistrict(round: Round, district: District) {
  if (
    round.Districts.findIndex((x) => x.DistNumber === district.DistNumber) ===
    -1
  ) {
    round.Districts.push({ DistNumber: district.DistNumber, Players: [] });
  }

  return round.Districts.findIndex((x) => x.DistNumber === district.DistNumber);
}
