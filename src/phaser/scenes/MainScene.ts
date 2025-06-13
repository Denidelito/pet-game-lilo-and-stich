import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('logo', 'assets/logo.png');
  }

  create() {
    const logo = this.add.image(400, 300, 'logo');
    this.tweens.add({
      targets: logo,
      y: 100,
      duration: 1500,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}
