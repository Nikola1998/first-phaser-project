let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image("ground", "assets/ground.png");
  this.load.image("background", "assets/background.png");
  this.load.spritesheet("chap-idle", "assets/chap-idle.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet("chap-run", "assets/chap-run.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet("chap-die", "assets/chap-die.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
}

let ground;
let player;

function create() {
  // WORLD
  this.add.image(400, 300, "background").setScale(0.22);

  ground = this.physics.add.staticGroup();

  for (let i = 0; i < 14; i++) {
    const x = i * 64 - 32;
    ground.create(x, 600, "ground").setScale(0.5).refreshBody();
  }
  //WORLD

  // PLAYER
  player = this.physics.add
    .sprite(100, 500, "chap-idle")
    .setScale(0.5)
    .refreshBody();
  player.setCollideWorldBounds(true);
  // PLAYER

  // PHYSICS
  this.physics.add.collider(player, ground);
  // PHYSICS

  // ANIMATIONS
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("chap-idle", { start: 0, end: 4 }),
    frameRate: 3,
    repeat: -1,
  });
  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("chap-run", { start: 0, end: 7 }),
    frameRate: 3,
    repeat: -1,
  });
  this.anims.create({
    key: "die",
    frames: this.anims.generateFrameNumbers("chap-die", { start: 0, end: 4 }),
    frameRate: 3,
    repeat: 0,
  });
  // ANIMATIONS
}

function update() {}
