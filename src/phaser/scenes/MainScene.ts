import Phaser from 'phaser';
import {ParallaxBackground} from "../objects/ParallaxBackground.ts";
import {Player} from "../objects/Player.ts";

export class MainScene extends Phaser.Scene {
  public bg!: ParallaxBackground;
  private player!: Player;


  constructor() {
    super('MainScene');
  }

  create() {
    this.bg = new ParallaxBackground(this, [
      {texture: 'bg', speedX: 10, depth: -4},
      {texture: 'bg-cloud-1', speedX: 20, depth: -2},
      {texture: 'bg-cloud-2', speedX: 10, depth: -1},
      {texture: 'bg-rock', speedX: 0, depth: -3},
      {texture: 'bg-front', speedX: 0, depth: -1},
      {texture: 'bg-glass', speedX: 0, depth: 2},
    ]);

    this.player = new Player(this, {
      y: this.scale.height - 30,
      texture: 'player',
      stepSoundKey: 'player-move',
    });

    this.input.keyboard?.on('keydown-LEFT', () => this.player.moveLeft());
    this.input.keyboard?.on('keydown-RIGHT', () => this.player.moveRight());
  }

  update(_time: number, delta: number) {
    this.bg.update(_time, delta);
  }
}
