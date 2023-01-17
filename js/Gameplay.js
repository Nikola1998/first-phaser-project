export default class Gameplay extends Phaser.Scene {
  constructor() {
    super("Gameplay");

    this.ground;
    this.player;
    this.playerHealth = 3;
    this.playerHealthText;
    this.cursors;
    this.points;
    this.neededScore = 1;
    this.currentScore = 0;
    this.scoreText;
    this.particles;
    this.demons;
    this.demonParticles;
    this.gameOver = false;
    this.enemyCollider;
    this.pointCollider;
  }
  preload() {
    // GRAPHICS
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

    // SOUND
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("point", "assets/sounds/point.mp3");
    this.load.audio("death", "assets/sounds/death.mp3");
    this.load.audio("start", "assets/sounds/start.mp3");
    this.load.audio("theme", "assets/sounds/theme.mp3");
    this.load.audio("hit", "assets/sounds/hit.mp3");
    this.load.audio("doing-good", "assets/sounds/doing-good.mp3");
    this.load.audio("end-game", "assets/sounds/end-game.mp3");
  }

  create() {
    // WORLD
    this.add.image(400, 300, "background").setScale(0.22);

    this.ground = this.physics.add.staticGroup();

    for (let i = 0; i < 14; i++) {
      const x = i * 64 - 32;
      this.ground.create(x, 600, "ground").setScale(0.5).refreshBody();
    }
    for (let i = 12; i < 20; i++) {
      const x = i * 25.6 - 32;
      this.ground.create(x, 480, "ground").setScale(0.2).refreshBody();
    }
    for (let i = 5; i < 12; i++) {
      const x = i * 25.6 - 12;
      this.ground.create(x, 360, "ground").setScale(0.2).refreshBody();
    }
    for (let i = 25; i < 29; i++) {
      const x = i * 25.6 - 12;
      this.ground.create(x, 360, "ground").setScale(0.2).refreshBody();
    }
    for (let i = 18; i < 24; i++) {
      const x = i * 25.6 - 12;
      this.ground.create(x, 240, "ground").setScale(0.2).refreshBody();
    }
    //WORLD

    // UI
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.playerHealthText = this.add.text(
      600,
      16,
      "health: " + this.playerHealth,
      {
        fontSize: "32px",
        fill: "#000",
      }
    );
    // UI

    // PLAYER
    this.player = this.physics.add
      .sprite(100, 500, "chap-idle")
      .setScale(0.5)
      .refreshBody();
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(450);
    // PLAYER

    // PHYSICS
    this.physics.add.collider(this.player, this.ground);
    // PHYSICS

    // ANIMATIONS
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("chap-idle", {
        start: 0,
        end: 4,
      }),
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
    this.particles = this.add.particles("fire");
    this.demonParticles = this.add.particles("demon-particle");
    // PARTICLES

    // CONTROLS
    this.cursors = this.input.keyboard.createCursorKeys();
    // CONTROLS

    // POINTS
    this.points = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.points, this.ground);
    this.pointCollider = this.physics.add.overlap(
      this.player,
      this.points,
      this.collectPoint,
      null,
      this
    );
    this.spawnPoints(1);
    // POINTS

    // ENEMY
    this.demons = this.physics.add.group({ allowGravity: false });
    this.physics.add.collider(this.demons, this.ground);
    this.enemyCollider = this.physics.add.overlap(
      this.player,
      this.demons,
      this.damagePlayer,
      null,
      this
    );
    // ENEMY

    // MUSIC
    this.sound.play("theme", { loop: true });
    this.sound.play("start");
    // MUSIC
  }

  update() {
    if (!this.gameOver) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-230);
        this.player.flipX = true;
        this.player.anims.play("run", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(230);
        this.player.flipX = false;
        this.player.anims.play("run", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("idle", true);
      }

      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-470);
        this.sound.play("jump");
      }

      if (!this.player.body.touching.down) {
        this.player.anims.play("jump");
      }
    } else {
      this.input.keyboard.on("keydown", function () {});
    }
  }

  collectPoint(player, point) {
    let emitter = point.getData("emitter");
    emitter.stop();
    point.destroy();
    this.currentScore++;
    this.scoreText.setText("score: " + this.currentScore);
    if (this.points.countActive(true) === 0) {
      this.spawnPoints(this.neededScore <= 64 ? this.neededScore : 64);
      this.neededScore *= 2;
      this.spawnDemon();
      this.sound.play("doing-good");
    }
    this.sound.play("point");
  }

  spawnPoints(amount) {
    let y = this.player.y < 300 ? 520 : 30;
    let x;

    for (let i = 0; i < amount; i++) {
      x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      let point = this.points.create(x, y, "point").setScale(0.5).refreshBody();
      point.setBounce(1);
      point.setCollideWorldBounds(true);
      point.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-200, 200)
      );
      point.body.setGravityY(0);

      let emitter = this.particles.createEmitter({
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

  spawnDemon() {
    let y = this.player.y < 300 ? 520 : 30;
    let x =
      this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
    let demon = this.demons.create(x, y, "demon").setScale(0.6).refreshBody();
    demon.setTint(0xffffff);
    demon.tint = 0xffffff;
    demon.setBounce(1);
    demon.setCollideWorldBounds(true);
    demon.setVelocity(
      Phaser.Math.Between(-200, 200),
      Phaser.Math.Between(-200, 200)
    );

    let emitter = this.demonParticles.createEmitter({
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

  damagePlayer(player, demon) {
    this.playerHealth--;
    this.playerHealthText.setText("health: " + this.playerHealth);
    let emitter = demon.getData("emitter");
    emitter.stop();
    demon.destroy();
    if (this.playerHealth > 0) {
      this.sound.play("hit");
    }
    if (this.playerHealth === 0) {
      this.sound.stopAll();
      this.sound.play("death");
      this.sound.play("end-game");
      this.playerDeath();
    }
  }

  playerDeath() {
    this.gameOver = true;
    this.player.setTint(0xff0000);
    this.player.setVelocityX(0);
    this.player.anims.play("die");
    this.pointCollider.destroy();
    this.enemyCollider.destroy();
  }
}
