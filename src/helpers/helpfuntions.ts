import { District } from "../types/District";
import { Game } from "../types/Game";
import { Player } from "../types/Player";
import { NewPlayerMap } from "./playerMap";

export function makeId(length: number) {
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

export function MakeGame(totalPlayers: Player[]): Game {
  const game: Game = {
    Districts: [],
    Channel: null,
    Rounds: [],
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
