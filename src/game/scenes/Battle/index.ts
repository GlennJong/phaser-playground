import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';

import BattleSelfCharacter from './BattleSelfCharacter';
import BattleOpponentCharacter from './BattleOpponentCharacter';

const contents = [
    { icon: { key: 'tamagotchi_character_afk', frame: 'face-normal' }, text: 'READY TO BATTLE!'},
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
    self: BattleSelfCharacter;
    opponent: BattleOpponentCharacter;
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
        this.handleStartGameScene();
        // setTimeout(() => {
        // }, 5000);
        
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


        // init characters
        this.opponent = new BattleOpponentCharacter(
            scene,
            { key: 'battle_beibei' },
            {
                name: '貝貝',
                hp: 100,
                max_hp: 100,
            }
        );

        this.self = new BattleSelfCharacter(
            scene,
            { key: 'battle_afk' },
            {
                name: 'AFK',
                hp: 100,
                max_hp: 100,
            }
        );

        // default hide status board
        this.self.board.setAlpha(0);
        this.opponent.board.setAlpha(0);


        // init dialogue
        this.dialogue = new PrimaryDialogue(scene);
    }

    private generateRandomBattleProcess(): TProcess[] {
        const step = Math.floor(Math.random() * 10) + 10;
        const result: TProcess[] = [];

        for (let i = 0; i < step; i++) {
            result.push({
                from: ['self', 'opponent'][i%2],
                type: ['attack', 'sp'][Math.random() > 0.5 ? 0 : 1],
                // damage: Math.floor(Math.random() * 100),
                // action: ['HIT', 'BITE', 'KICK'][Math.floor(Math.random() * 3)]
            })
        }

        return result;
    }

    private async applyBattle(process: TProcess[]) {
        for (let i = 0; i < process.length; i++) {
            const { from, type } = process[i];
            const actionCharacter = from === 'self' ? this.self : this.opponent; 
            const sufferCharacter = from !== 'self' ? this.self : this.opponent; 
            // const sentence = `${from === 'self' ? 'YOU' : 'ENEMY'} ${action} ${from !== 'self' ? 'YOU' : 'ENEMY'}, CAUSED ${damage} DAMAGES!`
            
            const actionData = type === 'sp' ? actionCharacter.sp() : actionCharacter.attack();
            let isFinished = false;
            
            // TODO: dialog refaceter:
            // return: icon, value, type, setnences($variable)
            if (actionData.type === 'damage') {
                await this.dialogue.runDialog([{ icon: { key: 'tamagotchi_character_afk', frame: 'face-normal' }, text: `Damage: ${actionData.value}`}])
                isFinished = await sufferCharacter.getDamage(actionData.value);
            }
            else if (actionData.type === 'recover') {
                await this.dialogue.runDialog([{ icon: { key: 'tamagotchi_character_afk', frame: 'face-normal' }, text: `Recover: ${actionData.value}`}])
                isFinished = await sufferCharacter.getRecover(actionData.value);
            }
            // await actionCharacter.attack();
            // await this.dialogue.runDialog([{ icon: { key: 'tamagotchi_character_afk', frame: 'face-normal' }, text: '123'}])
            if (isFinished) {
                actionCharacter.winBattle();
                sufferCharacter.loseBattle();
                this.handleFinishGame();
                return;
            }
            else {
                await this.dialogue.runDialog([{ icon: { key: 'tamagotchi_character_afk', frame: 'face-normal' }, text: 'TURN!'}])
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
        // sceneConverter(this.scene.scene, 'Room');
    }
    

    private async openingCharacterMovement() {
        this.self.setAlpha(0);
        this.opponent.setAlpha(0);
        
        // run self opening animation
        this.self.setAlpha(1);
        await this.self.openingCharacter();

        // run battle introduce
        await this.dialogue.runDialog(contents);

        // run opponent opening animation
        this.opponent.setAlpha(1);
        await this.opponent.openingCharacter();

        // show status board for both
        this.self.board.setAlpha(1);
        this.opponent.board.setAlpha(1);

    }

}
