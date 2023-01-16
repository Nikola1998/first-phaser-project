let gameScene = new Phaser.Scene("Game");

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: gameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

let game = new Phaser.Game(config);
