export default class Points extends Phaser.Physics.Arcade.Group {
  constructor(world, scene, player, particles) {
    super(world, scene);

    this.player = player;
    this.particles = particles;
  }

  spawnPoints(amount) {
    let y = this.player.y < 300 ? 520 : 30;
    let x;

    for (let i = 0; i < amount; i++) {
      x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      let point = this.create(x, y, "point").setScale(0.5).refreshBody();
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
}
