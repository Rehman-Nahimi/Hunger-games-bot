import { MakeGame, makeid } from "./helpers/helpfuntions";
import { Game } from "./types/Game";
import { Player } from "./types/Player";

//Constants for Test Usage
const NAME_LENGTHS = 16;
const URL_LENGTHS = 24;
const COUNT_PLAYERS = 22;
const totalPlayers: Player[] = [];

//Adding Test Items
for (let i = 0; i < COUNT_PLAYERS; i++) {
  totalPlayers.push({
    IsAlive: true,
    Name: makeid(NAME_LENGTHS),
    Url: makeid(URL_LENGTHS),
  });
}

// Here is the Important Part
// -------------------------------------
//Create the game needs more Logic here
const game = MakeGame(totalPlayers);
// -------------------------------------



//Show the Items and such in Console like preview.
console.table(
  game.Districts.map((val) => ({
    District_Number: val.DistNumber,
    Player_Objects: val.Players,
  }))
);

//Showing all Districts
for (let index = 0; index < game.Districts.length; index++) {
  console.log(`Show Players in District ${index}`);

  //To Show Results
  console.table(
    game.Districts[index].Players.map((val) => ({
      Player_Name: val.Name,
      Player_Url: val.Url,
    }))
  );
}
