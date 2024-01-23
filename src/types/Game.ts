import { District } from "./District";

export interface Game {
  Districts: District[];

  PlayGame(game:Game): void;
}
