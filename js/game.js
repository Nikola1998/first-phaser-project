import Gameplay from "./Gameplay.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Gameplay],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

let game = new Phaser.Game(config);
