import { Interval } from "../types/Interval";

export const intervalMap: Interval[] = [
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

export function FindCorrespondingValue(value: number): number {
  const item = intervalMap.find(
    (x) => x.lower_value <= value && x.top_value > value
  );

  if (item !== undefined) {
    return item.target_value;
  }
  return -1;
}
