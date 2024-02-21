import { District } from "./District";

export interface Round {
    DiedInROund: District[];

  HadEvent: District[];

  AliveDistricts: District[];

  RoundNumber: number;
}
