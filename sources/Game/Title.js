import { Game } from "./Game.js";

export class Title {
  constructor() {
    this.game = Game.getInstance();
    this.game.ticker.events.on(
      "tick",
      () => {
        this.update();
      },
      14,
    );
  }

  update() {
    document.title = "NK Drive";
  }
}