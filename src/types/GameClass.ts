import { MakeGameV2 } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";

export class GameClass implements Game {
  Districts: District[] = [];
  
  //Placeholder for the Intervall Process Id.
  readonly intervalId;

  constructor(players: Player[], intervalTime = 5000) {
    this.Districts = MakeGameV2(players).Districts;

    console.log(this.Districts.length);

    this.intervalId = setInterval(
      function (game) {
        game.PlayGame(game);
      },
      intervalTime,
      this
    );
  }

  PlayGame(game: GameClass): void {
    //Here out the Logic for the game rounds or start it.
    if (game.Districts.length > 0) {
      game.Districts.splice(0, 1);

      console.table(game.Districts);
    } else {
      //Needed to end the Set-Interval (Automated round calls).
      clearTimeout(game.intervalId);

      console.log("its finished");
    }
  }
}
