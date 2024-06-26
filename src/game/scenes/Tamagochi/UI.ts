import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';

export class Button extends Phaser.GameObjects.Container {
    onPointerDown!: () => void;
    onPointerUp!: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
        text: string,
    )
    {
        super(scene);

        this.scene = scene;
        this.x = x;
        this.y = y;

        const button = this.scene.add.image(x, y, `${key}_up`).setInteractive();
        const buttonText = this.scene.add.text(
            x,
            y,
            text,
            { fontSize: '28px', color: '#000000' }
        );
        
        Phaser.Display.Align.In.Center(buttonText, button);
        
        this.add(button);
        this.add(buttonText);

        button.on('pointerover', () => {
            button.setTexture(`${key}_down`);
        });
        button.on('pointerout', () => {
            button.setTexture(`${key}_up`);
        });
        
        button.on('pointerdown', () => {
            button.setTexture(`${key}_down`);
            if (this.onPointerDown) {
                this.onPointerDown();
            }
        });

        button.on('pointerup', () => {
            button.setTexture(`${key}_up`);
            if (this.onPointerUp) {
                this.onPointerUp();
            }
        });

        this.scene.add.existing(this);
    }
}

export default class UI extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('UI');
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('star', 'star.png');
        this.load.image('star_up', 'star.png');
        this.load.image('star_down', 'star_reverse.png');
        this.load.image('background-header', 'background-header.png');
    }

    create ()
    {

        this.scene.bringToTop();
        this.background = this.add.image(canvas.width/2, 0, 'background-header');

        const shopButton = new Button(this, 30, 30, 'star', 'shop');
        const roomButton = new Button(this, 80, 30, 'star', 'room');
        shopButton.onPointerDown = () => this.goToShop();
        roomButton.onPointerDown = () => this.goToRoom();

        this.gameText = this.add.text(160, 30, 'This is UI', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
    goToShop()
    {
        console.log('go to sshop')
        this.scene.stop('Room');
        this.scene.switch('Shop');
    }
    goToRoom()
    {
        console.log('go to room')
        this.scene.stop('Shop');
        this.scene.switch('Room');
    }

}
