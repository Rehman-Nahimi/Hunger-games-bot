import { User } from "discord.js";

export interface Player {
  Name: string;

  Url: string;

  IsAlive: boolean;

  SurvivalRate: number;

  Events: string[];

  User: string; 
}
