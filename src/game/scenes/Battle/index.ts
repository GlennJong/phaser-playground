import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';
import { runTween } from '../../utils/runTween';
import { StatusBoard } from './StatusBoard';

const contents = [
    { icon: 'happy_1', text: 'HERE\' COME A CHALLENGER.'},
    { icon: 'happy_2', text: 'READY TO BATTLE!'},
]

export default class Battle extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    self: Phaser.GameObjects.Image;
    selfBoard: StatusBoard;
    opponent: Phaser.GameObjects.Image;
    dialogue: PrimaryDialogue;

    constructor ()
    {
        super('Battle');
    }

    preload()
    {
        this.load.setPath('assets');
        this.load.image('background-battle', 'background-battle.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xEEEEEE);

        this.handleInitGameScene(this);
        this.handleStartGameScene(this);

        
        EventBus.emit('current-scene-ready', this);
    }
    update() {
        this.selfBoard.updateStatusBoard();
    }
    
    private handleInitGameScene(scene: Phaser.Scene) {

        this.background = scene.make.image({
            key: 'background-battle',
            x: canvas.width/2,
            y: canvas.height/2,
        });

        this.dialogue = new PrimaryDialogue(scene);


        this.self = scene.make.image({
            key: 'battle-character-1',
            x: 40,
            y: 80
        });

        this.opponent = scene.make.image({
            key: 'battle-character-2',
            x: 120,
            y: 40
        });


        this.selfBoard = new StatusBoard(scene, 110, 80);

        this.selfBoard.decreaseHP(60, () => {
            // console.log('finish');
        });
        // setInterval(() => {
        //     console.log('fire');
        // }, 3000)
        
    }

    private async handleStartGameScene(scene: Phaser.Scene) {
        await this.openingCharacterMovement();
        
    }

    // methods
    private async openingCharacterMovement() {
        
        this.opponent.setAlpha(0);
        
        this.self.setX(100);

        await runTween(this.self, { x: 20 }, 1000);
        
        await this.dialogue.runDialog(contents);

        await runTween(this.opponent, { alpha: 1 }, 1000);

        return;

    }

}
