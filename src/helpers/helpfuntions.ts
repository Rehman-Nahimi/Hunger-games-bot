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

  //Equation for the player per District
  const count = totalPlayers.length;
  const playerPerGroup = 2;
  const districtCount = count / playerPerGroup;

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

  //Equation for the player per District
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
