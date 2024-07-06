import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';
import { Header } from '../Header';
import { TamagochiCharacter } from './TamagochiCharacter';
import { HeartBar } from './HeartBar';

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

    private tamagochi: TamagochiCharacter;
    private heartBar: HeartBar;

    constructor ()
    {
        super('Room');
    }
    preload()
    {}
    
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
        this.heartBar = new HeartBar(scene, 15, 45, 100);
    }
    
    
    
    update(time: number) {
        
        // movement controller
        this.tamagochi.characterHandler(time);
        this.heartBar.update(this.tamagochi.status.hp);
        
    }
}
