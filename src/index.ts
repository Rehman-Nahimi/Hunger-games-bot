import nodeHtmlToImage from "node-html-to-image";
import fs from "fs";


const file = fs.readFileSync("view\\temp.html", "utf-8");

nodeHtmlToImage({
  output: "Out\\image.png",
  html: file,
});
