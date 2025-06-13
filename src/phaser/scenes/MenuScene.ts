import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create(): void {
        const { width, height } = this.scale;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const bgKey = isMobile ? 'bg-mobile' : 'bg-desktop';

        this.add
            .image(width / 2, height / 2, bgKey)
            .setOrigin(0.5)
            .setDisplaySize(width, height);

        this.add
            .text(width / 2, height / 2 - 100, 'MY GAME', {
                fontSize: '48px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        const playButton = this.add
            .text(width / 2, height / 2 + 20, '▶ START', {
                fontSize: '32px',
                color: '#ffcc00',
                backgroundColor: '#333',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playButton.on('pointerdown', () => {
            this.scene.start('MainScene');
        });

        playButton.on('pointerover', () => {
            playButton.setStyle({ color: '#ffffff' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ color: '#ffcc00' });
        });
    }
}
