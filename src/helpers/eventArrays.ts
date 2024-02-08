import { Player } from "../types/Player";
import { GetRandomIndex } from "./helpfuntions";

class BaseScenario {
  private readonly Scenario: string[];

  constructor(scenarios: string[]) {
    this.Scenario = scenarios;
  }

  public GetScenario(player: Player) {
    const index: number = GetRandomIndex(SingleScenario.length);

    const scenarioResult = this.Scenario[index].replace("{0}", player.Name);

    return scenarioResult;
  }
}

class SingleScenario extends BaseScenario {
  constructor(scenarios: string[]) {
    super(scenarios);
  }
}

export const miscScenario = new SingleScenario([
  "{0} hunts fish",
  "{0} avoids a pack of lions",
  "{0} hides away in the trees ",
]);

export const deathScenario = new SingleScenario([
  "{0} fell over and hit their head on a rock.",
  "Lions corner {0}. He is bitten into viciously",
  "{0} dies by dehydration",
  "{0} dies of hunger",
  "{0} falls off the map",
  "A supply crate drops on the {0}'s head. {0} dies",
  "{0} accidentally cuts himself and gets infected. ",
  "{0} bleeds out due to untreated wounds",
]);
