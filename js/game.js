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
let playerTurnedRight = true;
let cursors;

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
    frameRate: 7,
    repeat: -1,
  });
  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("chap-run", { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "die",
    frames: this.anims.generateFrameNumbers("chap-die", { start: 0, end: 4 }),
    frameRate: 3,
    repeat: 0,
  });
  this.anims.create({
    key: "jump",
    frames: [{ key: "chap-run", frame: 6 }],
    frameRate: 20,
  });
  // ANIMATIONS

  // CONTROLS
  cursors = this.input.keyboard.createCursorKeys();
  // CONTROLS
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
    player.flipX = true;
    player.anims.play("run", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
    player.flipX = false;
    player.anims.play("run", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("idle", true);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-250);
  }

  if (!player.body.touching.down) {
    player.anims.play("jump");
  }
}
