import { RoundGenerator } from "./helpers/helpfuntions";
import { District } from "./types/District";


// Test District with values
const testDist: District = {
  DistNumber: 1,
  Players: [
    {
      District: 1,
      IsAlive: true,
      Name: "dragon",
      Url: "https://cdn.discordapp.com/avatars/262185111955570689/d0ba1fac2d11e986cbbff972391b9639.webp?quality=lossless&size=4096",
      SurvivalRate: 1, 
      Scenario: -1,
    },
    {
      SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: false,
      Name: "Milk",
      Url: "https://cdn.discordapp.com/avatars/1011247677079560242/e1f4bdcd076bdbd2cca25ab15b883964.webp?quality=lossless&size=4096",
    },
    {    SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: true,
      Name: "Ray",
      Url: "https://cdn.discordapp.com/avatars/287332990990811146/f096c5114d7d3cfccfe55a992dae143e.webp?quality=lossless&size=4096",
    },
    {
      SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: true,
      Name: "dragon2",
      Url: "https://cdn.discordapp.com/avatars/262185111955570689/d0ba1fac2d11e986cbbff972391b9639.webp?quality=lossless&size=4096",
    },
    {
      SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: true,
      Name: "Milk2",
      Url: "https://cdn.discordapp.com/avatars/1011247677079560242/e1f4bdcd076bdbd2cca25ab15b883964.webp?quality=lossless&size=4096",
    },
    {
      SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: false,
      Name: "Ray2",
      Url: "https://cdn.discordapp.com/avatars/287332990990811146/f096c5114d7d3cfccfe55a992dae143e.webp?quality=lossless&size=4096",
    },
    {
      SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: false,
      Name: "dragon3",
      Url: "https://cdn.discordapp.com/avatars/262185111955570689/d0ba1fac2d11e986cbbff972391b9639.webp?quality=lossless&size=4096",
    },
    {
      SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: true,
      Name: "Milk3",
      Url: "https://cdn.discordapp.com/avatars/1011247677079560242/e1f4bdcd076bdbd2cca25ab15b883964.webp?quality=lossless&size=4096",
    },
    {

      SurvivalRate: 1, 
      Scenario: -1, 
      District: 1,
      IsAlive: true,
      Name: "Ray3",
      Url: "https://cdn.discordapp.com/avatars/287332990990811146/f096c5114d7d3cfccfe55a992dae143e.webp?quality=lossless&size=4096",
    },
  ],
};

//const gameTest = new GameClass(testDist.Players);

//console.log(gameTest); 
RoundGenerator(testDist.Players); 
