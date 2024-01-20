import { District } from "./types/District";
import { Game } from "./types/Game";
import fs from "fs";
import { FindCorrespondingValue } from "./helpers/intervalMap";

export function CreateHtmlDistrict(district: District): string {
  let str = "";

  for (let i = 0; i < district.Players.length; i++) {
    str += ` <div>
        <h2>${district.Players[i].Name}</h2>
        <img src="${district.Players[i].Url}" alt="${district.Players[i].Url}">
    </div>`;
  }

  const result = ` <div>
  <h1>District ${district.DistNumber}  </h1>

  <div class="picture-container">
      ${str}
  </div>
    </div>`;

  return result;
}

const styles = fs.readFileSync("view\\styles.txt");
const template = `<html><head> ${styles} </head> <body>  {0} </body> </html>`;

export function CreateHtml(gameInstance: Game): string[] {
  //
  const htmlStrings: string[] = [];

  if (
    gameInstance.Districts.length > 0 &&
    gameInstance.Districts[0].Players.length > 0
  ) {
    const amountOfPlayer = gameInstance.Districts[0].Players.length;
    const maxDistrict = FindCorrespondingValue(amountOfPlayer);

    let districtHelper = "";
    let x = 0;
    for (let i = 0; i < gameInstance.Districts.length; i++) {
      districtHelper += CreateHtmlDistrict(gameInstance.Districts[i]);
      x++;
      if (x >= maxDistrict || i >=gameInstance.Districts.length) {
        const str = template.replace("{0}", districtHelper);
        htmlStrings.push(str);
        x = 0;
        districtHelper = ""; 
      }
      
    }
  }

  return htmlStrings;
}
