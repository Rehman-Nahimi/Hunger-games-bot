/* eslint-disable no-unused-vars */
import {
  SingleScenario,
  buffScenario,
  deathScenario,
  injuryScenario,
  lightBuffScenario,
  lightInjuryScenario,
  miscScenario,
} from "../helpers/eventArrays";
import { GetRandomIndex } from "../helpers/helpFunctions";

export enum Events {
  NoEvent,
  Death = 1,
  NoEvent2 = NoEvent,
  Injury,
  NoEvent3 = NoEvent,
  LightInjury,
  NoEvent4 = NoEvent,
  Misc,
  NoEvent5 = NoEvent,
  LightBuff,
  NoEvent6 = NoEvent,
  Buff,
}

//This is a Test Feature.
export const EzMapSzenario = new Map<Events, SingleScenario >([
  [Events.Death, deathScenario],
  [Events.Injury, injuryScenario],
  [Events.LightInjury, lightInjuryScenario],
  [Events.Misc, miscScenario],
  [Events.LightBuff, lightBuffScenario],
  [Events.Buff, buffScenario],
]);

export function randomEnum<T extends object>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
  const randomIndex = GetRandomIndex(enumValues.length);
  const randomEnumValue = enumValues[randomIndex];
  return randomEnumValue;
}