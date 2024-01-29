import { TextChannel } from "discord.js";
import { District } from "./District";

export interface Game {
    Districts : District[],


    Channel: TextChannel | null,
}