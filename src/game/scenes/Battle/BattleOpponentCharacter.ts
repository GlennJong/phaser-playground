import Phaser from 'phaser';
import { runTween } from '../../utils/runTween';
import { StatusBoard, TStatusBoardProps } from './StatusBoard';
import { Character } from '../../components/Character';

const fullWidth = 160;

const defaultCharacterPosition = {
  x: 130,
  y: 36,
};

const defaultStatusBoardPosition = {
  x: 50, y: 20
};

function getRandomDialog(data: string[]) {
    return data[Math.floor(Math.random() * data.length)];
}

export default class BattleOpponentCharacter extends Character
{
    public board: StatusBoard;
    private currentHp: number;

    // need apply from json format
    private iconBag: { [key: string]: undefined | { key: string, frame: string } } = {
        normal: undefined,
        attack: undefined,
        hurt: undefined,
    };

    // need apply from json format
    private dialogBag = {
        attack: [
            '我踢！',
            '我打！'
        ],
        sp: [
            '吃我的大招！',
            '特殊攻擊！'
        ],
        getDamage: [
            '好痛啦！',
            '不要打我！',
        ],
        getRecover: [
            '補血！我復活啦！',
            '補補血',
        ]
    }

    constructor (
        scene: Phaser.Scene,
        key: string,
        data: TStatusBoardProps,
    )
    {
        // step2: create Character instance
        super(
            scene,
            key,
            defaultCharacterPosition
        );

        // step3: define current hp
        this.currentHp = data.hp;
        
        this.playAnimation('idle');

        this.iconBag.normal = { key, frame: 'face-normal' };
        this.iconBag.attack = { key, frame: 'face-attack' };
        this.iconBag.hurt   = { key, frame: 'face-hurt' };
        
        
        // step4: set default character status board
        const boardPosition = defaultStatusBoardPosition;
        this.board = new StatusBoard(scene, boardPosition.x, boardPosition.y, data);

    }

    public async openingCharacter() {
        this.character.setPosition(defaultCharacterPosition.x - fullWidth, defaultCharacterPosition.y)
        await runTween(this.character, { x: defaultCharacterPosition.x }, 1000);
    }

    public getDamage(value: number) {

        const _playAnimation = async () => {
            function easeInOutCubic(x: number): number {
                return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
            }
            await runTween(this.character, { alpha: 0, repeat: 3 }, 100, easeInOutCubic);
            this.character.setAlpha(1);
            await this.board.decreaseHP(value);
        }
        
        // update hp value
        this.currentHp -= value;
        _playAnimation();
        // do suffering damage animation

        // end battle if hp is 0
        return {
            icon: this.iconBag.hurt,
            dialog: getRandomDialog(this.dialogBag.getDamage),
            isDead: this.currentHp <= 0
        };
    }

    public getRecover(value: number) {
        const _playAnimation = async () => {
            await runTween(this.character, { scale: 1.15, yoyo: true }, 200);
            await this.board.decreaseHP(value * -1);
        }
        
        // update hp value
        this.currentHp += value;
        _playAnimation();
        // do suffering damage animation

        // end battle if hp is 0
        return {
            icon: this.iconBag.normal,
            dialog: getRandomDialog(this.dialogBag.getRecover),
            isDead: this.currentHp <= 0
        };
    }

    public async winBattle() {
        // this.setAlpha(0.5);
        // this.board.setAlpha(1);
    }

    public async loseBattle() {
        this.setAlpha(0.5);
        this.board.setAlpha(0);
    }

    public sp() {
        const _playAnimation = async () => {
            await this.playAnimation('sp', 1000);
            this.playAnimation('idle');
        }
        _playAnimation();

        const value = 20;
        const ratio = (1 + (0.5 - Math.random()));
        
        return { 
            type: 'recover',
            target: 'self',
            value: Math.floor(value * ratio),
            icon: this.iconBag.attack,
            dialog: getRandomDialog(this.dialogBag.sp),
         };
    }

    public attack() {
        const _playAnimation = async () => {
            await runTween(this.character, { x: defaultCharacterPosition.x - 10 }, 100);
            await runTween(this.character, { x: defaultCharacterPosition.x }, 100);
            this.playAnimation('beibei-idle');
        }
        _playAnimation();
        
        const value = 10;
        const ratio = (1 + (0.5 - Math.random()));
        return {
            type: 'damage',
            target: 'self',
            value: Math.floor(value * ratio),
            icon: this.iconBag.normal,
            dialog: getRandomDialog(this.dialogBag.attack),
        };

    }

    public characterHandler() {
        this.board.updateStatusBoard();
    }

}
