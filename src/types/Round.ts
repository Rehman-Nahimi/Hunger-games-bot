import { District } from "./District";

export interface Round {
    DistrictAfterRound: District[];

  DistrictBeforeRound: District[];

  RoundNumber: number;
}
