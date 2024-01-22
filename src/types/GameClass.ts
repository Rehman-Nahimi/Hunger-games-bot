import { finished } from "stream";
import { MakeGameV2 } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";

export class GameClass implements Game {
  Districts: District[] = [];

  readonly intervalId;
  constructor(players?: Player[]) {
    if (players !== undefined) {
      this.Districts = MakeGameV2(players).Districts;

      console.log(this.Districts.length);
    }

    this.intervalId = setInterval(
      function (game) {
        game.PlayGame(game);
      },
      5000,
      this
    );
  }

  PlayGame(game: GameClass): void {
    if (this.Districts.length > 0) {
      this.Districts.splice(0, 1);

      console.table(this.Districts);
    } else {
      clearTimeout(this.intervalId);

      console.log("its finished");
    }
  }
}
