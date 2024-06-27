import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { Character } from './Character';

export default class Room extends Scene
{
    character: Phaser.GameObjects.Sprite;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    keyLeft: typeof Phaser.Input.Keyboard.KeyCodes | null;
    keyRight: typeof Phaser.Input.Keyboard | null;
    keyTop: typeof Phaser.Input.Keyboard | null;
    keyDown: typeof Phaser.Input.Keyboard | null;
    tamagochi: unknown;

    constructor ()
    {
        super('Room');
    }
    preload()
    {
        this.load.setPath('assets');

        this.load.image('star', 'star.png');
        this.load.atlas('person', 'spritesheets/person/spritesheet.png', 'spritesheets/person/spritesheet.json');

        this.load.image('star', 'star.png');
        this.load.spritesheet('mummy', 'mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
        this.load.image('background-room', 'background-room.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);

        this.background = this.add.image(canvas.width/2, canvas.height/2, 'background-room');
        this.background.setScale(1.5);
        
        this.tamagochi = new Character(this, 120, 220, 'person');

        this.scene.launch('UI');

        this.gameText = this.add.text(400, 200, 'This is Room', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (this.input.keyboard) {
            const cursors = this.input.keyboard.createCursorKeys();
            if (cursors.left.isDown) {
            this.tamagochi.moveDirection('left', 100);
            } else if (cursors.right.isDown) {
            this.tamagochi.moveDirection('right', 100);
            } else if (cursors.up.isDown) {
            this.tamagochi.moveDirection('top', 100);
            } else if (cursors.down.isDown) {
            this.tamagochi.moveDirection('down', 100);
            }
            this.tamagochi.updatePosition();
        }

    }
}
