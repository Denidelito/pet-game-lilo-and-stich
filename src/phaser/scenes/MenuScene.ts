import Phaser from 'phaser';
import {ParallaxBackground} from '../objects/ParallaxBackground.ts';

export class MenuScene extends Phaser.Scene {
    public bg!: ParallaxBackground;

    constructor() {
        super('MenuScene');
    }

    create(): void {
        this.bg = new ParallaxBackground(this, [
            {texture: 'bg', speedX: 10, depth: -4},
            {texture: 'bg-cloud-1', speedX: 20, depth: -2},
            {texture: 'bg-cloud-2', speedX: 10, depth: -1},
            {texture: 'bg-rock', speedX: 0, depth: -3},
            {texture: 'bg-front', speedX: 0, depth: -1},
            {texture: 'bg-glass', speedX: 0, depth: -1},
        ]);
    }

    update(_time: number, delta: number) {

        this.bg.update(_time, delta);
    }
}
