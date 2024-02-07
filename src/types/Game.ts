import { TextChannel } from "discord.js";
import { District } from "./District";
import { Round } from "./Round";

export interface Game {
    Districts : District[],


    Channel: TextChannel | null,


    Rounds: Round[],
}