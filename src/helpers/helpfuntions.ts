import { Game } from "../types/Game";
import { Player } from "../types/Player";

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
  
  const count = totalPlayers.length;
  const playerPerGroup = 2;
  const districtCount = count / playerPerGroup;
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
