import React, {useEffect, useRef} from 'react';
import Phaser from 'phaser';
import {MainScene, MenuScene, PreloadScene} from "../../../phaser/scenes";

export const GameWrapper: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gameRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width,
            height,
            parent: gameRef.current,
            scene: [PreloadScene, MenuScene, MainScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {debug: false},
            },
            backgroundColor: '#000000',
        });

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameRef} style={{width: '100vw', height: '100vh'}}/>;
};
