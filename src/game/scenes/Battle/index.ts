import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';

import { runTween } from '../../utils/runTween';
import { StatusBoard } from './StatusBoard';
import BattleCharacter from './BattleCharacter';

const contents = [
    { icon: 'happy_1', text: 'HERE\' COME A CHALLENGER.'},
    { icon: 'happy_2', text: 'READY TO BATTLE!'},
]

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

        this.handleInitGameScene(this);

        setTimeout(() => {
            this.handleStartGameScene();
        }, 5000);
        
        EventBus.emit('current-scene-ready', this);
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

        this.dialogue = new PrimaryDialogue(scene);

        this.self = new BattleCharacter(scene, { key: 'default-battle' }, 'self', { name: 'good friend' });
        this.opponent = new BattleCharacter(scene, { key: 'battle-character-1' }, 'opponent', { name: 'bad boy' });

        this.self.board.setAlpha(0);
        this.opponent.board.setAlpha(0);
    }

    private generateRandomBattleProcess() {
        const step = Math.floor(Math.random() * 10) + 10;
        const result = [];

        for (let i = 0; i < step; i++) {
            result.push({
                from: ['self', 'opponent'][i%2],
                damage: Math.floor(Math.random() * 10),
                action: ['HIT', 'BITE', 'KICK'][Math.floor(Math.random() * 3)]
            })
        }

        return result;
    }

    private async applyBattle(process) {
        for (let i = 0; i < process.length; i++) {
            const { from, damage, action } = process[i];
            const actionCharacter = from === 'self' ? this.self : this.opponent; 
            const sufferCharacter = from !== 'self' ? this.self : this.opponent; 
            const sentence = `${from === 'self' ? 'YOU' : 'ENEMY'} ${action} ${from !== 'self' ? 'YOU' : 'ENEMY'}, CAUSED ${damage} DAMAGES!`
            
            await actionCharacter.attack();
            await this.dialogue.runDialog([{ icon: 'happy_1', text: sentence}])
            await sufferCharacter.sufferDamage(damage);
            await this.dialogue.runDialog([{ icon: 'happy_2', text: 'TURN!'}])
        }
    }

    private async handleStartGameScene() {
        await this.openingCharacterMovement();
        const process = this.generateRandomBattleProcess();
        this.applyBattle(process);
    }

    // methods
    private async openingCharacterMovement() {
        
        
        await this.self.openingCharacter();
        
        await this.dialogue.runDialog(contents);
        
        await this.opponent.openingCharacter();

        this.self.board.setAlpha(1);
        this.opponent.board.setAlpha(1);

    }

}
