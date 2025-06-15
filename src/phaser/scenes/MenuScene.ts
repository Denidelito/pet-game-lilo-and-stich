import Phaser from 'phaser';
import {ParallaxBackground} from '../objects/ParallaxBackground.ts';
import {SoundButtonUI} from '../ui/SoundButtonUI.ts';
import {PlayButtonUI} from '../ui/PlayButtonUI.ts';
import {isMobile} from "../utils/device.ts";

export class MenuScene extends Phaser.Scene {
    public bg!: ParallaxBackground;

    constructor() {
        super('MenuScene');
    }

    create(): void {
        const {width, height} = this.scale;
        const mobile = isMobile();

        this.bg = new ParallaxBackground(this, [
            {texture: 'bg', speedX: mobile ? 5 : 10, depth: -4, positionX: 0, positionY: 0},
            {texture: 'bg-cloud-1', speedX: mobile ? 10 : 20, depth: -2, positionX: 0, positionY: 0},
            {texture: 'bg-cloud-2', speedX: mobile ? 5 : 10, depth: -1, positionX: 0, positionY: 0},
            {texture: 'bg-rock', speedX: 0, depth: -3, positionX: 0, positionY: 0},
            {texture: 'bg-front', speedX: 0, depth: -1, positionX: 0, positionY: 0},
            {texture: 'bg-glass', speedX: 0, depth: -1, positionX: 0, positionY: 0},
        ]);

        new PlayButtonUI(this, {
            x: width / 2,
            y: height / 2,
            texture: 'button-play',
            targetScene: 'MainScene',
            clickSoundKey: 'button-click',
            scale: mobile ? 0.9 : 1
        });

        new SoundButtonUI(this, {
            x: width - 79,
            y: 79,
            textureOn: 'sound-on',
            textureOff: 'sound-off',
            initialMuted: false,
            scale: mobile ? 0.9 : 1
        });
    }

    update(_time: number, delta: number): void {
        this.bg.update(_time, delta);
    }
}
