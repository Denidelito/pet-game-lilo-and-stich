export class TabFocusController {
    private readonly scene: Phaser.Scene;
    private wasPaused = false;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    private handleVisibilityChange = (): void => {
        if (document.hidden) {
            if (!this.scene.scene.isPaused()) {
                this.scene.scene.pause();
                this.wasPaused = true;
            }
        } else {
            if (this.wasPaused) {
                this.scene.scene.resume();
                this.wasPaused = false;
            }
        }
    };

    public destroy(): void {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}
