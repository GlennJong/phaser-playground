import Phaser from 'phaser';

const defaultDuration = 1000;
const defaultEase = 'sine.inout';

interface TransitionTweenSpriteProps {
    key: string,
    from: { width: number, height: number } & Phaser.Types.GameObjects.Sprite.SpriteConfig,
    to: { width: number, height: number } & Phaser.Types.GameObjects.Sprite.SpriteConfig,
    duration?: number,
    ease?: string,
}

export class TransitionTweenSprite extends Phaser.GameObjects.Container {
    private sprite: Phaser.GameObjects.Sprite;
    private tween: Phaser.Tweens.BaseTween;

    constructor(
        scene: Phaser.Scene,
        props: TransitionTweenSpriteProps,
    )
    {
        const { key = 'star', from, to, duration = defaultDuration, ease = defaultEase } = props;
        
        // 1. Inherite from scene
        super(scene);
        this.scene = scene;

        // 2. Create sprite
        const sprite = scene.make.sprite({
            key,
            ...from
        });
        sprite.width = from.width || 0;
        sprite.height = from.height || 0;
        
        // 3. Create tween
        const tween = scene.tweens.add({
            targets: sprite,
            repeat: 0,
            duration,
            ease,
            ...to,
        });

        this.add(sprite);
        this.sprite = sprite;
        this.tween = tween;
        this.tween.pause();
        
        this.setVisible(false);
        scene.add.existing(this); // Add to scene
    }

    
    public run = (): Promise<void> => {
        this.setVisible(true);
        return new Promise(resolve => {
            this.tween.resume();
            this.tween.once('complete', () => {
                this.sprite.setVisible(false);
                this.setVisible(false);
                resolve();
            });
        })
    }
    
}

