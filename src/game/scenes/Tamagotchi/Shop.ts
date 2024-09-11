import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';

export default class Shop extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Shop');
    }

    preload()
    {
        this.load.setPath('assets');
        this.load.image('background-shop', 'background-shop.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xEEEEEE);

        this.background = this.add.image(canvas.width/2, canvas.height/2, 'background-shop');

        this.scene.launch('UI');

        this.gameText = this.add.text(100, 300, 'Shop', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Room');
    }
}
