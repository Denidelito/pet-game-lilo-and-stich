export const transitionToScene = (
    scene: Phaser.Scene,
    targetScene: string,
    duration = 500
): void => {
    scene.cameras.main.fadeOut(duration, 0, 0, 0);

    scene.cameras.main.once('camerafadeoutcomplete', () => {
        scene.scene.start(targetScene);
    });
};
