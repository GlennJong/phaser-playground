import Phaser from 'phaser';

type TOption = {
  x: number,
  y: number,
}

export class RoomRecorder extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        option: TOption
    )
    {
        // Inherite from scene
        super(scene);

        const { x, y } = option;

        // Icon

        const recorder = scene.make.sprite({
            key: 'tamagotchi_room_player',
            frame: 'recorder-2',
            x: x,
            y: y,
        });

        scene.anims.create({
            key: 'recoreder-play',
            frames: scene.anims.generateFrameNames('tamagotchi_room_recorder', { prefix: `recorder-`, start: 1, end: 12 }),
            repeat: -1,
            frameRate: 6
        });

        recorder.play('recoreder-play');

        // switch animation here...
        // window.play('window-cloud');

        this.add(recorder);

        scene.add.existing(this);
    }

}

