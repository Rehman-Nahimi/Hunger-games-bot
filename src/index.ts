import nodeHtmlToImage from "node-html-to-image";
import fs from "fs";
import { CreateHtml, CreateHtmlDistrict } from "./HtmlFactory";
import { District } from "./types/District";
import { Game } from "./types/Game";
import { Player } from "./types/Player";
import { MakeGameV2, MakeGameV3, makeid } from "./helpers/helpfuntions";

// const file = fs.readFileSync("view\\temp.html", "utf-8");

// Test District with values
const testDist: District = {
  DistNumber: 1,
  Players: [
    {
      IsAlive: true,
      Name: "dragon",
      Url: "https://cdn.discordapp.com/avatars/262185111955570689/d0ba1fac2d11e986cbbff972391b9639.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "Milk",
      Url: "https://cdn.discordapp.com/avatars/1011247677079560242/e1f4bdcd076bdbd2cca25ab15b883964.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "Ray",
      Url: "https://cdn.discordapp.com/avatars/287332990990811146/f096c5114d7d3cfccfe55a992dae143e.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "dragon",
      Url: "https://cdn.discordapp.com/avatars/262185111955570689/d0ba1fac2d11e986cbbff972391b9639.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "Milk",
      Url: "https://cdn.discordapp.com/avatars/1011247677079560242/e1f4bdcd076bdbd2cca25ab15b883964.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "Ray",
      Url: "https://cdn.discordapp.com/avatars/287332990990811146/f096c5114d7d3cfccfe55a992dae143e.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "dragon",
      Url: "https://cdn.discordapp.com/avatars/262185111955570689/d0ba1fac2d11e986cbbff972391b9639.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "Milk",
      Url: "https://cdn.discordapp.com/avatars/1011247677079560242/e1f4bdcd076bdbd2cca25ab15b883964.webp?quality=lossless&size=4096",
    },
    {
      IsAlive: true,
      Name: "Ray",
      Url: "https://cdn.discordapp.com/avatars/287332990990811146/f096c5114d7d3cfccfe55a992dae143e.webp?quality=lossless&size=4096",
    },
  ],
};
const styles = fs.readFileSync("view\\styles.txt");
const createdDist = CreateHtmlDistrict(testDist);
const district1 = `<html><head> ${styles} </head> <body>  ${createdDist} </body> </html>`;

async function test() {
  //Creates the Image and saves it to the disk, should try to change it to buffer maybe
  const image = await nodeHtmlToImage({
    html: district1,
    output: "Out\\image.png"
  });

  console.log(image.toString());
}

// test();

async function Crazytest(Game  : Game){

  const str =  CreateHtml(Game);
  
  for (let i = 0; i < str.length; i++) {
    const image = await nodeHtmlToImage({
      html: str[i],
      output: `Out\\image_${i}.png`
    });
  }
}

//Constants for Test Usage
const URL_LENGTHS = 24;
const COUNT_PLAYERS = 36;

const totalPlayers: Player[] = [];

//Adding Test Items
for (let i = 0; i < COUNT_PLAYERS; i++) {
  totalPlayers.push({
    IsAlive: true,
    Name:  `Player ${i}`, // or use makeid(NAME_LENGTHS)
    Url: makeid(URL_LENGTHS),
  });
}

//Show the Items and such in Console like preview.
console.log("The test Users");
console.table(
  totalPlayers.map((val) => ({
    Name_Player: val.Name,
    Url_player_pic: val.Url,
  }))
);

// Here is the Important Part
// -------------------------------------
//Create the game needs more Logic here
const game = MakeGameV3(COUNT_PLAYERS);
// -------------------------------------

Crazytest(game); 

//Show the Items and such in Console like preview.
console.log("The districts ");
console.table(
  game.Districts.map((val) => ({
    DistNumber: val.DistNumber,
    Players: val.Players.toString(),
  }))
);