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
  this.load.image("point", "assets/point.png");
  this.load.image("demon", "assets/demon.png");
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

  // PARTICLES
  this.load.image("fire", "assets/fire-particle.png");
  this.load.image("demon-particle", "assets/demon-particle.png");
}

let ground;
let player;
let playerHealth = 3;
let playerHealthText;
let cursors;
let points;
let neededScore = 1;
let currentScore = 0;
let scoreText;
let particles;
let demons;
let demonParticles;
let gameOver = false;
let enemyCollider;
let pointCollider;

function create() {
  // WORLD
  this.add.image(400, 300, "background").setScale(0.22);

  ground = this.physics.add.staticGroup();

  for (let i = 0; i < 14; i++) {
    const x = i * 64 - 32;
    ground.create(x, 600, "ground").setScale(0.5).refreshBody();
  }
  for (let i = 12; i < 20; i++) {
    const x = i * 25.6 - 32;
    ground.create(x, 480, "ground").setScale(0.2).refreshBody();
  }
  for (let i = 5; i < 12; i++) {
    const x = i * 25.6 - 12;
    ground.create(x, 360, "ground").setScale(0.2).refreshBody();
  }
  for (let i = 25; i < 30; i++) {
    const x = i * 25.6 - 12;
    ground.create(x, 360, "ground").setScale(0.2).refreshBody();
  }
  for (let i = 18; i < 24; i++) {
    const x = i * 25.6 - 12;
    ground.create(x, 240, "ground").setScale(0.2).refreshBody();
  }
  //WORLD

  // UI
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  playerHealthText = this.add.text(600, 16, "health: " + playerHealth, {
    fontSize: "32px",
    fill: "#000",
  });
  // UI

  // PLAYER
  player = this.physics.add
    .sprite(100, 500, "chap-idle")
    .setScale(0.5)
    .refreshBody();
  player.setCollideWorldBounds(true);
  player.body.setGravityY(450);
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
    frameRate: 14,
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
    frames: [{ key: "chap-run", frame: 0 }],
    frameRate: 20,
  });
  // ANIMATIONS

  // PARTICLES
  particles = this.add.particles("fire");
  demonParticles = this.add.particles("demon-particle");
  // PARTICLES

  // CONTROLS
  cursors = this.input.keyboard.createCursorKeys();
  // CONTROLS

  // POINTS
  points = this.physics.add.group({ allowGravity: false });

  this.physics.add.collider(points, ground);
  pointCollider = this.physics.add.overlap(
    player,
    points,
    collectPoint,
    null,
    this
  );
  spawnPoints(1);
  // POINTS

  // ENEMY
  demons = this.physics.add.group({ allowGravity: false });
  this.physics.add.collider(demons, ground);
  enemyCollider = this.physics.add.overlap(
    player,
    demons,
    damagePlayer,
    null,
    this
  );
  // ENEMY
}

function update() {
  if (!gameOver) {
    if (cursors.left.isDown) {
      player.setVelocityX(-230);
      player.flipX = true;
      player.anims.play("run", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(230);
      player.flipX = false;
      player.anims.play("run", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("idle", true);
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-470);
    }

    if (!player.body.touching.down) {
      player.anims.play("jump");
    }
  }
}

function collectPoint(player, point) {
  let emitter = point.getData("emitter");
  emitter.stop();
  point.destroy();
  currentScore++;
  scoreText.setText("score: " + currentScore);
  if (points.countActive(true) === 0) {
    spawnPoints(neededScore <= 64 ? neededScore : 64);
    neededScore *= 2;
    spawnDemon();
  }
}

function spawnPoints(amount) {
  let y = player.y < 300 ? 520 : 30;
  let x;

  for (let i = 0; i < amount; i++) {
    x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
    let point = points.create(x, y, "point").setScale(0.5).refreshBody();
    point.setBounce(1);
    point.setCollideWorldBounds(true);
    point.setVelocity(
      Phaser.Math.Between(-200, 200),
      Phaser.Math.Between(-200, 200)
    );
    point.body.setGravityY(0);

    let emitter = particles.createEmitter({
      speed: 5,
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 0 },
      blendMode: "ADD",
      tint: { start: 0x99e550, end: 0x99e550 },
      frequency: 110,
    });
    emitter.startFollow(point);
    point.setData({ emitter: emitter });
  }
}

function spawnDemon() {
  let y = player.y < 300 ? 520 : 30;
  let x =
    player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);
  let demon = demons.create(x, y, "demon").setScale(0.6).refreshBody();
  demon.setTint(0xffffff);
  demon.tint = 0xffffff;
  demon.setBounce(1);
  demon.setCollideWorldBounds(true);
  demon.setVelocity(
    Phaser.Math.Between(-200, 200),
    Phaser.Math.Between(-200, 200)
  );

  let emitter = demonParticles.createEmitter({
    speed: 10,
    alpha: { start: 1, end: 0 },
    scale: { start: 0.8, end: 0.2 },
    blendMode: "ADD",
    tint: { start: 0xffffff, end: 0xffffff },
    frequency: 110,
  });
  emitter.startFollow(demon);
  demon.setData({ emitter: emitter });
}

function damagePlayer(player, demon) {
  playerHealth--;
  playerHealthText.setText("health: " + playerHealth);
  let emitter = demon.getData("emitter");
  emitter.stop();
  demon.destroy();
  if (playerHealth === 0) {
    playerDeath();
  }
}

function playerDeath() {
  gameOver = true;
  player.setTint(0xff0000);
  player.setVelocityX(0);
  player.anims.play("die");
  pointCollider.destroy();
  enemyCollider.destroy();
}
