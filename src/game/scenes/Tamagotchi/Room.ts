import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';
import { Header } from './Header';
import { TamagotchiCharacter } from './TamagotchiCharacter';
import { RoomWindow } from './RoomWindow';
import { RoomRecorder } from './RoomRecorder';
import { sceneConverter, sceneStarter } from '../../components/CircleSceneTransition';

type TInheritData = {
    hp: number,
    mp: number
}

export default class Room extends Scene
{
    character: Phaser.GameObjects.Sprite;
    camera: Phaser.Cameras.Scene2D.Camera;
    header: Header;
    keyboardInputer?: Phaser.Types.Input.Keyboard.CursorKeys;

    private tamagotchi: TamagotchiCharacter;

    constructor ()
    {
        super('Room');
    }
    init(data: TInheritData)
    {
        this.handleRenderScene(this, data);

    }
    preload()
    {

    }
    create ()
    {        
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);

        sceneStarter(this);

        EventBus.emit('current-scene-ready', this);
    }

    private dialogue: PrimaryDialogue;

    private handleRenderScene(scene: Phaser.Scene, data: TInheritData) {
        const background = scene.add.image(canvas.width/2, canvas.height/2, 'tamagotchi_room');
        background.displayWidth = canvas.width;
        background.displayHeight = canvas.height;

        // Dialogue
        const dialogue = new PrimaryDialogue(scene);
        this.dialogue = dialogue;

        // Window
        new RoomWindow(scene, { x: 80, y: 32 });

        // Recorder
        new RoomRecorder(scene, { x: 26, y: 62 })

        scene.make.sprite({ key: 'tamagotchi_room_desk', x: 134, y: 48 });

        // Header Block
        this.header = new Header(scene);
        // this.header.setAlpha(0); // TODO: auto hide
        
        // Build Tamagotchi Charactor
        this.tamagotchi = new TamagotchiCharacter(
            scene,
            {
                 x: 80, y: 84,
                 edge: { from: 50, to: 120 },
                 hp: data.hp,
                 callbackFunctions: {
                    onHpChange: (value: number) => this.header.setValue({hp: value}),
                }
            },
        );

        // apply hp
        this.header.setValue({ hp: this.tamagotchi.status.hp });
        this.keyboardInputer = scene.input.keyboard?.createCursorKeys();
        
    }

    private isFunctionalRunning: boolean = false;
    private functionalActionQuene: string[] = [];

    private handleFunctionalActionQuene = async() => {
        this.isFunctionalRunning = true;
        const currentAction = this.functionalActionQuene[0];

        const _run = async() => {
            const result = this.tamagotchi.runFuntionalAction(currentAction);
            if (result) {
                await this.dialogue.runDialog(result.dialog);
                this.isFunctionalRunning = false;
                this.functionalActionQuene.splice(0, 1);
            }
            else {
                setTimeout(_run, 100);
            }
        }

        _run();
    }
    
    controller(input: string) {
        console.log(input);
        // this.tamagotchi.manualContolAction(input);
    }

    private keyboardflipFlop = { left: false, right: false, space: false };

    private async handleHeaderAction(action: string) {
        this.functionalActionQuene.push(action);

        // TODO: 4 different actions here
        // drink, battle, write, sleep
        // const result = this.tamagotchi.runFuntionalAction(action);
        // if (typeof result === 'undefined') return;
        
        // if (result?.dialog) {
        //     await this.dialogue.runDialog(result.dialog);
        // }
        
        // // Special action: Battle
        // if (action === 'battle') {
        //     sceneConverter(this, 'Battle', this.tamagotchi.status);
        // }

    }
    
    update(time: number) {
        
        if (this.functionalActionQuene.length !== 0 && !this.isFunctionalRunning) {
            this.handleFunctionalActionQuene();
        }
        
        // movement controller
        this.header.statusHandler();
        this.tamagotchi.characterHandler(time);

        // temp Controller
        if (this.keyboardInputer) {
            if (this.keyboardInputer.left.isDown) {
                if (this.keyboardflipFlop.left) return;
                this.header.moveToPreviousSelector();
                this.keyboardflipFlop.left = true;
            }
            else if (this.keyboardflipFlop.left && this.keyboardInputer['left'].isUp) {
                this.keyboardflipFlop.left = false;
            }

            if (this.keyboardInputer['right'].isDown) {
                if (this.keyboardflipFlop.right) return;
                this.header.moveToNextSelector();
                this.keyboardflipFlop.right = true;
            }
            else if (this.keyboardflipFlop.right && this.keyboardInputer['right'].isUp) {
                this.keyboardflipFlop.right = false;
            }

            if (this.keyboardInputer['space'].isDown) {
                if (this.keyboardflipFlop.space) return;
                // const currentSelector = this.header.currentSelector;
                // this.header.currentSelector;
                this.handleHeaderAction(this.header.currentSelector);
                this.keyboardflipFlop.space = true;
            }
            else if (this.keyboardflipFlop.space && this.keyboardInputer['space'].isUp) {
                this.keyboardflipFlop.space = false;
            }
        }
        
    }

}
