import { Player } from "../types/Player";
import { GetRandomIndex } from "./helpfuntions";

class BaseScenario {
  constructor(private Scenario: string[]) {}

  public GetScenario(player: Player) {
    const index: number = GetRandomIndex(this.Scenario.length);

    const scenarioResult = this.Scenario[index].replace("{0}", player.Name);

    return scenarioResult;
  }
}

class MiscScenario extends BaseScenario {
  constructor(scenarios: string[]) {
    super(scenarios);
  }
}

class DeathScenario extends BaseScenario {
  constructor(scenarios: string[]) {
    super(scenarios);
  }
}

export const miscScenario = new MiscScenario([
  "{0} hunts fish",
  "{0} avoids a pack of lions",
  "{0} hides away in the trees",
]);

export const deathScenario = new DeathScenario([
  "{0} fell over and hit their head on a rock.",
  "Lions corner {0}. He is bitten into viciously",
  "{0} dies by dehydration",
  "{0} dies of hunger",
  "{0} falls off the map",
  "A supply crate drops on the {0}'s head. {0} dies",
  "{0} accidentally cuts himself and gets infected. ",
  "{0} bleeds out due to untreated wounds",
]);

export const injuryScenario = new DeathScenario([
  "{0} loses leg to a man eating monkey.",
  "{0} falls over and gets a concussion",
  "{0} touches a poisonous flower",
  "{0} is bit by a rare spider species ",
  "{0} catches a very bad illness",
]);

export const lightInjuryScenario = new DeathScenario([
  "{0} sprains ankle while tripping up thinking about their crush",
  "{0} pulls a leg while running ",
  "{0} injures his shoulder lifting heavy objects",
]);

export const lightBuffScenario = new DeathScenario([
  "{0} finds old tools in a cave",
  "{0} is given water and bandages from a sponsor",
  "{0} finds rabbits to hunt and eat",
  "{0} wakes up from a nap about his crush, they feel energetic",
]);

export const buffScenario = new DeathScenario([
  "{0} finds a gun with 3 bullets",
  "{0} is given a medkit from a sponsor ",
  "{0} steals another parties food and supplies",
]);