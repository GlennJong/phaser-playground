import Phaser from 'phaser';

export function runTween<T>(
    obj: { scene: Phaser.Scene } & T,
    options: { [key: string]: number },
    duration: number,
): Promise<void> | undefined {
    const { scene } = obj;
    if (scene) {
        let tween: Phaser.Tweens.BaseTween | undefined = obj.scene.tweens.add({
            targets: obj,
            repeat: 0,
            duration,
            ...options
        });
    
        return new Promise(resolve => {
            if (!tween) {
                resolve()
                return;
            }
            tween.once('complete', () => {
                if (tween) {
                    tween.remove();
                    tween = undefined
                }
                resolve();
            });
        })
    }
}