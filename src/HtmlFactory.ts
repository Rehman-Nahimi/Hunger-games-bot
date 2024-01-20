import { District } from "./types/District";

export function CreateHtmlDistrict(district: District):string {
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
