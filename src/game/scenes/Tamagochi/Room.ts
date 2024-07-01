import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { Character } from './Character';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';

const contents = [
    { icon: 'happy_1', text: 'HELLO WORLD!\nTHIS IS THE EXAMPLE TO DEMONSTRATE THE DIALOGUE.'},
    { icon: 'happy_2', text: 'PHASER JS IS THE MOST INTERESTING GAME FRAMEWORK IN THE WORD!'},
    { icon: 'happy_1', text: '字型是俐方體11！'},
]


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
        this.load.atlas('default_character', 'spritesheets/default/motions.png', 'spritesheets/default/motions.json');
        this.load.image('background-room', 'background-room.png');
        this.load.image('happy_1', 'spritesheets/default/1.png');
        this.load.image('happy_2', 'spritesheets/default/2.png');
        
        this.load.atlas('frame', 'ui/frame.png', 'ui/frame.json');
    }
    
    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);
        
        this.background = this.add.image(canvas.width/2, canvas.height/2, 'background-room');
        this.background.displayWidth = canvas.width;
        this.background.displayHeight = canvas.height;

        const board = new PrimaryDialogue(this);

        async function startDialog() {
            const status = await board.runDialog(contents);
            console.log(status, 'wwweeee');
        }

        setTimeout(() => {
            startDialog();
        }, 1000)
        
        

        this.tamagochi = new Character(this, 100, 100, 'default_character');

        EventBus.emit('current-scene-ready', this);
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
                    const activity = ['sleep', false][Math.floor(Math.random() * 2)]
                    if (activity) {
                        this.tamagochi.doActivity(activity);
                    }
                }
                this.fireEach5sec = Math.floor(time/1000)/5;
            }
            this.tamagochi.updatePosition();
        }
    }
}
