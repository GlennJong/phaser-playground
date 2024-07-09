import Phaser from 'phaser';
import { runTween } from '../../utils/runTween';
import { StatusBoard } from './StatusBoard';
import { CharacterProps, Character } from '../../components/Character';

const defaultCharacterPosition = {
    self: { x: 30, y: 80 },
    opponent: { x: 130, y: 30 },
}

const defaultStatusBoardPosition = {
    self: { x: 110, y: 80 },
    opponent: { x: 50, y: 20 },
}

type TAnimsConfig = {
    key: string,
    qty: number,
    freq?: number,
    duration?: number,
    repeat: number,
}

const animsConfigs: { [key: string]: TAnimsConfig[] } = {
    'battle-character-1': [
        { key: 'normal',  qty: 2, freq: 2, repeat: -1 },
        { key: 'attack', qty: 2, freq: 2, repeat: -1 },
        { key: 'damage',  qty: 2, freq: 12, repeat: -1 },
    ]
}

export default class BattleCharacter extends Character
{
    // private character: Phaser.GameObjects.Sprite;
    public board: StatusBoard;
    private role: 'self' | 'opponent';

    constructor (
        scene: Phaser.Scene,
        props: CharacterProps,
        role: 'self' | 'opponent',
        data: any,
    )
    {

        // step1: get default role position
        const characterPosition = defaultCharacterPosition[role];
        
        // step2: create Character instance
        super(
            scene,
            {
                ...characterPosition,
                ...props
            }
        );
        
        // step2: 
        this.playAnimation('normal');

        const boardPosition = defaultStatusBoardPosition[role];
        this.board = new StatusBoard(scene, boardPosition.x, boardPosition.y, data.name);

    }

    public async openingCharacter() {
        if (this.role === 'self') {
            this.character.setX(100);
            await runTween(this.character, { x: 20 }, 1000);
        }
        else if (this.role === 'opponent') {
            this.character.setX(180);
            await runTween(this.character, { x: 120 }, 1000);
        }
    }

    public async sufferDamage(value: number) {
        this.playAnimation('damage');
        await this.board.decreaseHP(value);
        this.playAnimation('normal');
    }

    public async attack() {
        await this.playAnimation('attack');
        this.playAnimation('normal');
    }

    public characterHandler() {
        this.board.updateStatusBoard();
    }

}
