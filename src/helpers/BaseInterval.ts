import { Interval } from "../types/Interval";

export class BaseInterval {
  // eslint-disable-next-line no-unused-vars
  constructor (private intervals: Interval[]){}

  // Method to find Corresponding Intervals
  public static FindCorrespondingValue(thisInterval: BaseInterval,  value: number): number {
    const item = thisInterval.intervals.find(
      (x) => x.lower_value <= value && x.top_value >= value
    );

    if (item !== undefined) {
      return item.target_value;
    }
    return -1;
  }
  
  static get (thisInterval: BaseInterval, target:number){
    const item = thisInterval.intervals.find(
      (x) => x.lower_value <= target && x.top_value > target
    );

    if (item !== undefined) {
      return item.target_value;
    }
    return -1;
  }
}
