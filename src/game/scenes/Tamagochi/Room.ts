import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { Character } from './Character';
import { Dialogue } from '../../ui/Dialogue';

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
    tamagochi: Character;

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
        

        this.load.atlas('ui', 'ui/nine-slice.png', 'ui/nine-slice.json');
        // this.load.atlas('dialog', 'spritesheets/dialog/spritesheet.png', 'spritesheets/dialog/spritesheet.json');
    }
    
    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);
        
        
        this.background = this.add.image(canvas.width/2, canvas.height/2, 'background-room');
        this.background.setScale(1.5);

        // const board = this.add.nineslice(400, 300, 'ui', 'blue-box', 100, 100, 16, 16, 32, 16);

        const board = new Dialogue(this, 400, 300, 100, 100, 'blue-box', 'text');

        this.tweens.add({
            targets: board,
            width: 300,
            height: 300,
            duration: 1000,
            ease: 'sine.inout',
            yoyo: true,
            repeat: -1,
        });
        
        this.tamagochi = new Character(this, 220, 220, 'person');

        this.scene.launch('UI');

        this.gameText = this.add.text(400, 200, 'This is Room', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
        // console.log(this.game.loop.actualFps);
    }

    private fireEach5sec = 0;
    
    update(time: number) {
        // movement controller
        // if (this.input.keyboard) {
        //     const cursors = this.input.keyboard.createCursorKeys();
        //     if (cursors.left.isDown) {
        //     this.tamagochi.moveDirection('left', 32);
        //     } else if (cursors.right.isDown) {
        //     this.tamagochi.moveDirection('right', 32);
        //     } else if (cursors.up.isDown) {
        //     this.tamagochi.moveDirection('top', 32);
        //     } else if (cursors.down.isDown) {
        //     this.tamagochi.moveDirection('down', 32);
        //     }
        //     this.tamagochi.updatePosition();
        // }
        if (Math.floor(time/1000)%5 === 0) {
            if (Math.floor(time/1000)/5 !== this.fireEach5sec) {
                if (this.fireEach5sec % 5 !== 0) {
                    const direction = ['left', 'right', false][Math.floor(Math.random() * 3)]
                    if (direction) {
                        this.tamagochi.moveDirection(direction, 32);
                    }
                }
                else {
                    const activity = ['sleeping', false][Math.floor(Math.random() * 2)]
                    if (activity) {
                        this.tamagochi.doActivity(activity);
                    }
                }
                this.fireEach5sec = Math.floor(time/1000)/5;
            }
            this.tamagochi.updatePosition();
        }
        
        // activity controller
        // if (Math.floor(time/1000)%10 === 0) {
        //     if (Math.floor(time/1000)/10 !== this.fireEach10sec) {
        //         const activity = ['sleeping', false][Math.floor(Math.random() * 2)]
        //         if (activity) {
        //             this.tamagochi.doActivity(activity);
        //             this.fireEach10sec = Math.floor(time/1000)/10;
        //         }
        //     }
        // }

        // console.log(time);
        // if (Number.isInteger(time / 16))
        // console.log(time/10000);
        // console.time('123');
        // if (timer / (1000 * 5))
        
        // if (time / 1000) == 5) {
        //     console.log('work');
        // }
        // console.log(Math.floor(time / (10 * 1000))); // triger each 10s
        // if (Math.floor(time / (10 * 1000)))
        // console.log(time);
        // const value = Phaser.Math.FloatBetween(0, 1);
        // console.log(value);

        // if (delta < 16) {
        //     console.log('work')
        // }
    }
}
