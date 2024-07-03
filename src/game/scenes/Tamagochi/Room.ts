import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { Character } from './Character';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';
import { Header } from '../Header';
import { TamagochiCharacter } from './TamagochiCharacter';

const contents = [
    { icon: 'happy_1', text: 'OJOSAMA, IT\' TIME TO GO TO BED.'},
    { icon: 'happy_2', text: 'YARE YARE'},
    { icon: 'happy_1', text: 'HELLO WORLD!\nTHIS IS THE EXAMPLE TO DEMONSTRATE THE DIALOGUE.'},
]


export default class Room extends Scene
{
    character: Phaser.GameObjects.Sprite;
    camera: Phaser.Cameras.Scene2D.Camera;
    
    keyLeft: typeof Phaser.Input.Keyboard.KeyCodes | null;
    keyRight: typeof Phaser.Input.Keyboard | null;
    keyTop: typeof Phaser.Input.Keyboard | null;
    keyDown: typeof Phaser.Input.Keyboard | null;

    private tamagochi: Character;

    constructor ()
    {
        super('Room');
    }
    preload()
    {
        this.load.setPath('assets');
        this.load.atlas('person', 'spritesheets/person/motions.png', 'spritesheets/person/motions.json');
        this.load.atlas('default', 'spritesheets/default/motions.png', 'spritesheets/default/motions.json');
        this.load.image('background-room', 'background-room.png');
        this.load.image('happy_1', 'spritesheets/default/1.png');
        this.load.image('happy_2', 'spritesheets/default/2.png');
        this.load.atlas('frame', 'ui/frame.png', 'ui/frame.json');

        // this.load.image('star', 'star.png');
        this.load.image('star_up', 'star.png');
        this.load.image('star_reverse', 'star.png');
        
    }
    
    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);
        
        this.handleRenderScene(this);

        EventBus.emit('current-scene-ready', this);
    }

    private handleRenderScene(scene: Phaser.Scene) {
        const background = scene.add.image(canvas.width/2, canvas.height/2, 'background-room');
        background.displayWidth = canvas.width;
        background.displayHeight = canvas.height;

        // Header Block
        const header = new Header(scene);
        const board = new PrimaryDialogue(scene);

        async function startDialog() {
            const status = await board.runDialog(contents);
            console.log(status, 'wwweeee');
        }

        setTimeout(() => {
            startDialog();
        }, 1000)
        
        

        // Build Tamagochi Charactor
        this.tamagochi = new TamagochiCharacter(scene, 110, 100, 'default');
        // this.tamagochi2 = new Character(this, 70, 100, 'default_character');
    }
    
    
    private fireEach5sec = 0;
    
    update(time: number) {
        // movement controller
        this.tamagochi.characterHandler(time);

        
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
        // if (Math.floor(time/1000)%5 === 0) {
        //     if (Math.floor(time/1000)/5 !== this.fireEach5sec) {
        //         this.tamagochi.updateStatus();

        //         if (this.fireEach5sec % 5 !== 0) {
        //             const direction = ['left', 'right', false][Math.floor(Math.random() * 3)]
        //             if (direction) {
        //                 this.tamagochi.moveDirection(direction, 32);
        //             }
        //         }
        //         else {
        //             const activity = ['sleep', false][Math.floor(Math.random() * 2)]
        //             if (activity) {
        //                 this.tamagochi.doActivity(activity);
        //             }
        //         }
        //         this.fireEach5sec = Math.floor(time/1000)/5;
        //     }
        //     this.tamagochi.updatePosition();
        // }
    }
}
