import { District } from "./District";
import { GameClass } from "./GameClass";

export interface Game {
  Districts: District[];

  PlayGame(game:GameClass): void;
}
