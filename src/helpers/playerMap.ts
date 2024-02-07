import { Interval } from "../types/Interval";
import { BaseInterval } from "./BaseInterval";

const playerMap: Interval[] = [
  {
    lower_value: 0,
    top_value: 6,
    target_value: 1,
  },
  {
    lower_value: 6,
    top_value: 12,
    target_value: 1,
  },
  {
    lower_value: 12,
    top_value: 24,
    target_value: 2,
  },
  {
    lower_value: 24,
    top_value: 36,
    target_value: 3,
  },
  {
    lower_value: 37,
    top_value: 48,
    target_value: 4,
  },
];

export class NewPlayerMap extends BaseInterval {
  constructor() {
    super(playerMap);
  }
}