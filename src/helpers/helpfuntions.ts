import { Game } from "../types/Game";
import { Player } from "../types/Player";
import { NewPlayerMap } from "./playerMap";

const playerLimits = [6, 12, 24, 36, 48];
const playerCounts = playerLimits[Math.floor(Math.random() * playerLimits.length)];
console.log(playerCounts);

let districtCount = 12;

if (playerCounts <= 12) {
  districtCount = 6;
} else  {
  districtCount = 12; 
}
console.log(districtCount);

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
    Channel: null
  };

  //Equation for the player per District
 
  const playerPerGroup = playerCounts/districtCount;
  
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
    Channel: null
  };

  //Equation for the player per District
  const playerPerGroup = NewPlayerMap.FindCorrespondingValue(new NewPlayerMap,totalPlayers.length);

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
