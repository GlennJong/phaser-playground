import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';

import BattleCharacter from './BattleCharacter';
import { AUTO } from 'phaser';
import { sceneConverter } from '../../components/SceneTransition';

const contents = [
    { icon: 'happy_1', text: 'HERE\' COME A CHALLENGER.'},
    { icon: 'happy_2', text: 'READY TO BATTLE!'},
]

type TProcess = {
    from: 'self' | 'opponent',
    damage: number,
    action: string,
}

export default class Battle extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    self: BattleCharacter;
    opponent: BattleCharacter;
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

        // init
        this.handleInitGameScene(this);

        setTimeout(() => {
            this.handleStartGameScene();
        }, 5000);
        
        // EventBus.emit('current-scene-ready', this);
    }

    update() {
        this.self.characterHandler();
        this.opponent.characterHandler();
    }
    
    private handleInitGameScene(scene: Phaser.Scene) {

        this.background = scene.make.image({
            key: 'background-battle',
            x: canvas.width/2,
            y: canvas.height/2,
        });

        // init dialogue
        this.dialogue = new PrimaryDialogue(scene);

        // init characters
        this.self = new BattleCharacter(
            scene,
            { key: 'default-battle' },
            'self',
            {
                name: 'good friend',
                hp: 100,
                max_hp: 100,
            }
        );

        this.opponent = new BattleCharacter(scene,
            { key: 'default-battle' },
            'opponent',
            {
                name: 'bad boy',
                hp: 100,
                max_hp: 100,
            }
        );

        // default hide status board
        this.self.board.setAlpha(0);
        this.opponent.board.setAlpha(0);
    }

    private generateRandomBattleProcess(): TProcess[] {
        const step = Math.floor(Math.random() * 10) + 10;
        const result: TProcess[] = [];

        for (let i = 0; i < step; i++) {
            result.push({
                from: ['self', 'opponent'][i%2],
                damage: Math.floor(Math.random() * 100),
                action: ['HIT', 'BITE', 'KICK'][Math.floor(Math.random() * 3)]
            })
        }

        return result;
    }

    private async applyBattle(process: TProcess[]) {
        for (let i = 0; i < process.length; i++) {
            const { from, damage, action } = process[i];
            const actionCharacter = from === 'self' ? this.self : this.opponent; 
            const sufferCharacter = from !== 'self' ? this.self : this.opponent; 
            const sentence = `${from === 'self' ? 'YOU' : 'ENEMY'} ${action} ${from !== 'self' ? 'YOU' : 'ENEMY'}, CAUSED ${damage} DAMAGES!`
            
            await actionCharacter.attack();
            await this.dialogue.runDialog([{ icon: 'happy_1', text: sentence}])
            const result = await sufferCharacter.sufferDamage(damage);
            if (result) {
                actionCharacter.winBattle();
                sufferCharacter.loseBattle();
                this.handleFinishGame();
                return;
            }
            else {
                await this.dialogue.runDialog([{ icon: 'happy_2', text: 'TURN!'}])
            }
        }
    }

    private async handleStartGameScene() {
        await this.openingCharacterMovement();
        const process = this.generateRandomBattleProcess();
        this.applyBattle(process);
    }

    private async handleFinishGame() {
        await this.dialogue.runDialog([{ icon: 'happy_2', text: 'FINISH!\nBACK TO ROOM!'}])

        sceneConverter(this.scene.scene, 'Room');
    }
    

    private async openingCharacterMovement() {

        // run self opening animation
        await this.self.openingCharacter();

        // run battle introduce
        await this.dialogue.runDialog(contents);

        // run opponent opening animation
        await this.opponent.openingCharacter();

        // show status board for both
        this.self.board.setAlpha(1);
        this.opponent.board.setAlpha(1);

    }

}
