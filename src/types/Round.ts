import { District } from "./District";

export interface Round {
    DistrictAfterRound: District[];

  DistrictBeforeRound: District[];

  AliveDistricts: District[];

  RoundNumber: number;
}
