import { TextBasedChannel } from "discord.js";
import { District } from "./District";
import { Round } from "./Round";

export interface Game {
    Districts : District[],


    Channel: TextBasedChannel | null,


    Rounds: Round[],

    playersAlive: number, 

    roundId: number,
}