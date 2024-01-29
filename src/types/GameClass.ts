import nodeHtmlToImage from "node-html-to-image";
import { CreateGameHtml } from "../helpers/HtmlFactory";
import { MakeGameV2 } from "../helpers/helpfuntions";
import { District } from "./District";
import { Game } from "./Game";
import { Player } from "./Player";
import { TextChannel } from "discord.js";
import { channel } from "diagnostics_channel";

class GameClass implements Game {
   Districts: District[] = [];
   Channel: TextChannel | null = null;
  
  //Placeholder for the Intervall Process Id.
  private intervalId :NodeJS.Timeout |null = null;

  PrepareGame( players: Player[], channel: TextChannel,  intervalTime = 5000){
    this.Districts = MakeGameV2(players).Districts;
    this.Channel = channel; 
    this.intervalId = setInterval(
      function (game) {
        game.PlayGame(game);
      },
      intervalTime,
      this
    );
  }

  private PlayGame(game: GameClass): void {
    //Here out the Logic for the game rounds or start it.
    if (game.Districts.length > 0) {
      game.Districts.splice(0, 1);

      console.table(game.Districts);
      const str = CreateGameHtml(game);
      
       async ()=> {
        for (let i = 0; i < str.length; i++) {
          
          const image = await nodeHtmlToImage({
            html: str[i],
          });
          
          if (game.Channel !== null) {
            game.Channel.send(image.toString()); 
          }
        }
      };
    } else {
      //Needed to end the Set-Interval (Automated round calls).
      if(game.intervalId !== null){
        clearTimeout(game.intervalId);
      }

      console.log("its finished");
    }
  }
}

export const TestGame = new GameClass();