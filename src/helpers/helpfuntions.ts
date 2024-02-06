import { checkPrime } from "crypto";
import { Game } from "../types/Game";
import { Player } from "../types/Player";
import { Round } from "../types/Round";
import { FindCorrespondingValue} from "./playerMap";

const playerLimits = [6, 12, 24, 36, 48];
const playerCounts =
  playerLimits[Math.floor(Math.random() * playerLimits.length)];

let districtCount = 12;

if (playerCounts <= 12) {
  districtCount = 6;
} else {
  districtCount = 12;
}

export function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

//Makes the Game
export function MakeGame(totalPlayers: Player[]): Game {
  const game: Game = {
    Districts: [],
  };

  //Equation for the player per District

  const playerPerGroup = playerCounts / districtCount;

  //Extra counter for logic needed
  let x = 0;

  //Sets the players to the Districts
  //here comes the Logic with random Picks
  for (let i = 0; i < districtCount; i++) {
    game.Districts.push({ DistNumber: i, Players: [] });

    for (let j = 0; j < playerPerGroup; j++) {
      game.Districts[i].Players.push(totalPlayers[x]);
      x++;
    }
  }

  return game;
}

export function MakeGameV2(totalPlayers: Player[]): Game {
  const game: Game = {
    Districts: [],
  };

  //Equation for the player per Districtfilter
  const playerPerGroup = 2;
  
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

export function MakeGameV3(playerCount: number): Game {
  const game: Game = {
    Districts: [],
  };

  //Equation for the player per District
  const playerPerGroup = FindCorrespondingValue(playerCount);
  const distCount = playerCount / playerPerGroup;
  //Extra counter for logic needed

  for (let i = 0; i < distCount; i++) {
    if (game.Districts[i] === undefined) {
      game.Districts.push({ DistNumber: i + 1, Players: [] });
    }

    for (let j = 0; j < playerPerGroup; j++) {
      const playerAtIndex: Player = {
        IsAlive: true,
        District: 1,
        Name: makeid(8), // or use makeid(NAME_LENGTHS)
        Url: makeid(24),
        SurvivalRate: 1,
        Death: 0,
      };
      game.Districts[i].Players.push(playerAtIndex);
    }
  }
  return game;
}


function CheckDeath(player:Player) {
  let result: boolean;

  const randomInt = () =>
  Math.floor(Math.random() * (100));
  
  let number = player.SurvivalRate
  
  let answer = randomInt() * number

  if(number < 45){
    player.Scenario = 1
    return false; 
    }
    return true; 

  
}

export function RoundGenerator(totalPlayers:Player[]): Round {
  const round: Round = {
    Players: [],
  };

  const randomInt = () =>
  Math.floor(Math.random() * (10));

  round.Players = totalPlayers.filter((player) => player.IsAlive == true)

  console.table(round.Players)

  const playerCount = round.Players.length

  for (let j = 0; j < playerCount; j++) {

    switch(randomInt()) {

      case 1:
        round.Players[j].IsAlive = false
        round.Players[j].Scenario = 1
        break;
      case 2:
        round.Players[j].SurvivalRate -= 0.35
        round.Players[j].Scenario = 2
        break;
      case 3:
        round.Players[j].SurvivalRate += 0.35
        round.Players[j].Scenario = 3
        break;
      case 4:
        round.Players[j].SurvivalRate += 0.55
        round.Players[j].Scenario = 4
        break;
      case 5:
        round.Players[j].Scenario = 5
        break;
    }
    
    round.Players[j].IsAlive = CheckDeath(round.Players[j]);
}
console.table(round.Players)
  return round;
}