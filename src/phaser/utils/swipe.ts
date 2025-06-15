export const setupSwipeControls = (
    scene: Phaser.Scene,
    onLeft: () => void,
    onRight: () => void
): void => {
    let startX: number | null = null;

    scene.input.on('pointerdown', (pointer: { x: number | null; }) => {
        startX = pointer.x;
    });

    scene.input.on('pointerup', (pointer: { x: number; }) => {
        if (startX === null) return;
        const dx = pointer.x - startX;
        if (Math.abs(dx) > 50) {
            dx > 0 ? onRight() : onLeft();
        }
        startX = null;
    });
};
