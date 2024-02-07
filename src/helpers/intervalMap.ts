import { Interval } from "../types/Interval";
import { BaseInterval } from "./BaseInterval";

const intervalMap : Interval[]=  [
  {
    lower_value: 0,
    top_value: 4,
    target_value: 3,
  },
  {
    lower_value: 4,
    top_value: 8,
    target_value: 2,
  },
  {
    lower_value: 8,
    top_value: Number.MAX_VALUE,
    target_value: 1,
  },
]; 

export class NewIntervalMap extends BaseInterval{
  constructor() {
    super(intervalMap);
  }
}