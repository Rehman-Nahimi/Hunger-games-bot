import { District } from "../../types/District";
import { Game } from "../../types/Game";
import { NewIntervalMap } from "../intervalMap";
import fs from "fs";
import { FilterDistForDead } from "../helpfuntions";

const styles = fs.readFileSync("view/customStyles.css");
const template = `<html><head> <style> ${styles} </style> </head> <body>  {0} </body> </html>`;

export function CreateHtmlDistrict(district: District): string {
  let str = "";

  for (let i = 0; i < district.Players.length; i++) {
    str += ` <div>
    <h2>${district.Players[i].Name}</h2>
    <div class="${district.Players[i].IsAlive !== true ? "dead-player" : ""}">
    <img  src="${district.Players[i].Url}" alt="${district.Players[i].Url}">
    </div>
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

export function CreateGameHtml(game: Game): string[] {
  //Creates an Empty Array to fill with the Strings representing the HTMLs.
  const htmlStrings: string[] = [];

  if (game.Districts.length > 0 && game.Districts[0].Players.length > 0) {
    const amountOfPlayer = game.Districts[0].Players.length;
    const maxDistrict = NewIntervalMap.FindCorrespondingValue(
      new NewIntervalMap(),
      amountOfPlayer
    );

    let districtHelper = "";
    let x = 0;

    for (let i = 0; i < game.Districts.length; i++) {
      districtHelper += CreateHtmlDistrict(game.Districts[i]);
      x++;
      if (x >= maxDistrict || i + 1 >= game.Districts.length) {
        const str = template.replace("{0}", districtHelper);
        htmlStrings.push(str);
        x = 0;
        districtHelper = "";
      }
    }
  }

  return htmlStrings;
}

const DieTitel = "<h1>🤓--Following Players Died, R.I.P. Bozos--🤓</h1>";
export function CreateDieHTML(game: Game): string[] {
  //Create the HTML for the Dead Players.
  const htmlStrings: string[] = [];

  const listOfDist: District[] = FilterDistForDead(game.Districts);

  if (listOfDist.length > 0 && listOfDist[0].Players.length > 0) {
    const amountOfPlayer = listOfDist[0].Players.length;
    const maxDistrict = NewIntervalMap.FindCorrespondingValue(
      new NewIntervalMap(),
      amountOfPlayer
    );

    let districtHelper = DieTitel;
    let x = 0;

    for (let i = 0; i < listOfDist.length; i++) {
      districtHelper += CreateDieDistrict(listOfDist[i]);
      x++;
      if (x >= maxDistrict || i + 1 >= listOfDist.length) {
        const str = template.replace("{0}", districtHelper);
        htmlStrings.push(str);
        x = 0;
        districtHelper = "";
      }
    }
  }
  return htmlStrings;
}

function CreateDieDistrict(district: District): string {
  let str = "";

  for (let i = 0; i < district.Players.length; i++) {
    str += ` <div>
        <h2>${district.Players[i].Name}</h2>
        <div class="${
          district.Players[i].IsAlive !== true ? "dead-player" : ""
        }">
        <img  src="${district.Players[i].Url}" alt="${district.Players[i].Url}">
        </div>
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

