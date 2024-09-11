import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';

export default class Tamagotchi extends Scene
{
    timer: undefined;
    
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Tamagotchi');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xffff00);

        // this.scene.launch('UI');
        this.scene.launch('Room');

        EventBus.emit('current-scene-ready', this);
    }


    // changeScene ()
    // {
    //     this.scene.start('GameOver');
    // }
}
