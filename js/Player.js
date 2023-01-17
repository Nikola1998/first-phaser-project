export default class Player extends Phaser.Physics.Arcade.Image {
  constructor(world, scene) {
    super(world, scene);

    this.score = 0;
    this.playerHealth = 3;
  }
}
