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

export enum Events {
  NoEvent,
  Death = 1,
  Injury,
  NoEvent2 = NoEvent,
  LightInjury,
  Misc,
  NoEvent3 = NoEvent,
  LightBuff,
  Buff,
  NoEvent4 = NoEvent,
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
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  const randomEnumValue = enumValues[randomIndex];
  return randomEnumValue;
}