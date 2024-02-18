import { District } from "../types/District";
import { Game } from "../types/Game";
import { Player } from "../types/Player";
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

  for (let i = 0; i < districts.length; i++) {
    const element = districts[i];

    const filteredPlayers = element.Players.filter((x) => x.IsAlive !== true);
    if (filteredPlayers.length > 0) {
      result.push({
        DistNumber: element.DistNumber,
        Players: filteredPlayers,
      });
    }
  }
  return result;
}

export function FilterDistForAlive(roundDie: District[],   districts: District[]) {
  const result: District[] = [];

const playersDead = roundDie.flatMap((x)=>x.Players); 

  for (let i = 0; i < districts.length; i++) {
    const element = districts[i];

    const filteredPlayers = element.Players.filter((x) => x.IsAlive === true && playersDead.findIndex((dead)=> dead.Name === x.Name)=== -1 );
    if (filteredPlayers.length > 0) {
      const dist:District= {
        DistNumber: element.DistNumber,
        Players: []
      };
     
      for (let index = 0; index < filteredPlayers.length; index++) {
        const element = filteredPlayers[index];
        const player:Player = {
          Events: [],
          IsAlive: element.IsAlive,
          Name: element.Name,
          SurvivalRate: element.SurvivalRate,
          Url: element.Url
        }; 
        element.Events.forEach((x)=> player.Events.push(x)); 

        dist.Players.push(player); 
      }

      result.push(dist); 
    }
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