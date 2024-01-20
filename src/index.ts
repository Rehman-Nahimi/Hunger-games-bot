import nodeHtmlToImage from "node-html-to-image";
import fs from "fs";
import { CreateHtmlDistrict } from "./HtmlFactory";
import { District } from "./types/District";

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
  ],
};

const createdDist = CreateHtmlDistrict(testDist);
const district1 = `<html><head><style> img{width: 100px; height: auto;} h1, h2, img{ margin: 0; } p.test{ font-size: xx-large; } .picture-container {  display: flex; }  .picture-container>div { margin: 10px;  /* Optional: Add some margin between pictures */ text-align: center;  /* Optional: Center the text and image within each div */ } </style> </head> <body>  ${createdDist} </body> </html>`;

async function test() {
  //Creates the Image and saves it to the disk, should try to change it to buffer maybe
  const image = await nodeHtmlToImage({
    html: district1,
  });

  console.log(image.toString());
}
test();
