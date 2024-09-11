import Phaser from 'phaser';

type TOption = {
  x: number,
  y: number,
}

export class RoomWindow extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        option: TOption
    )
    {
        // Inherite from scene
        super(scene);

        const { x, y } = option;

        // Icon
        const window = scene.make.sprite({
            key: 'tamagotchi_room_window',
            frame: 'window-1',
            x: x,
            y: y,
        });

        scene.anims.create({
            key: 'window-cloud',
            frames: scene.anims.generateFrameNames('tamagotchi_room_window', { prefix: `window-`, start: 1, end: 3 }),
            repeat: -1,
            yoyo: true,
            frameRate: 0.5 // each frame by 2 sec
        });

        scene.anims.create({
            key: 'window-wind',
            frames: scene.anims.generateFrameNames('tamagotchi_room_window', { prefix: `window-`, start: 4, end: 9 }),
            repeat: -1,
            frameRate: 8
        });

        // switch animation here...
        window.play('window-cloud');

        window.on(Phaser.Animations.Events.ANIMATION_REPEAT, _ => {
            const isWind = Math.random() > 0.5;
            if (isWind) {
                window.play('window-wind');
            }
            else {
                window.play('window-cloud');
            }
        });

        this.add(window);

        scene.add.existing(this);
    }

}

