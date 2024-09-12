import Phaser from 'phaser';
import { runTween } from '../../utils/runTween';
import { StatusBoard, TStatusBoardProps } from './StatusBoard';
import { Character } from '../../components/Character';

const fullWidth = 160;

const defaultCharacterPosition = {
    x: 30, y: 90
}

const defaultStatusBoardPosition = {
    x: 110, y: 80
}


function getRandomDialog(data: string[]) {
    return data[Math.floor(Math.random() * data.length)];
}

export default class BattleSelfCharacter extends Character
{
    public board: StatusBoard;
    private currentHp: number;

    private iconBag: { [key: string]: undefined | { key: string, frame: string } } = {
        normal: undefined,
        attack: undefined,
        hurt: undefined,
    };

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
        super(
            scene,
            key,
            defaultCharacterPosition,
        );

        this.currentHp = data.hp;

        this.iconBag.normal = { key, frame: 'face-normal' };
        this.iconBag.attack = { key, frame: 'face-attack' };
        this.iconBag.hurt   = { key, frame: 'face-hurt' };
        
        this.playAnimation('self-idle');

        this.board = new StatusBoard(scene, defaultStatusBoardPosition.x, defaultStatusBoardPosition.y, data);

    }

    public async openingCharacter() {
        this.character.setPosition(defaultCharacterPosition.x + fullWidth, defaultCharacterPosition.y)
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

        // end battle if hp is 0
        return {
            icon: this.iconBag.normal,
            dialog: getRandomDialog(this.dialogBag.getRecover),
            isDead: this.currentHp <= 0
        };
    }


    public async winBattle() {
        // this.playAnimation('win');
        // this.board.setAlpha(0);
    }

    public async loseBattle() {
        this.setAlpha(0.5);
        this.board.setAlpha(0);
    }

    public sp() {
        const _playAnimation = async () => {
            await runTween(this.character, { x: defaultCharacterPosition.x + 10 }, 100);
            await runTween(this.character, { x: defaultCharacterPosition.x }, 100);
        }
        _playAnimation();

        const value = 20;
        const ratio = (1 + (0.5 - Math.random()));
        return {
            type: 'damage',
            target: 'opponent',
            value: Math.floor(value * ratio),
            icon: this.iconBag.attack,
            dialog: getRandomDialog(this.dialogBag.sp),
        };
    }

    public attack() {
        const _playAnimation = async () => {
            await runTween(this.character, { x: defaultCharacterPosition.x + 10 }, 100);
            await runTween(this.character, { x: defaultCharacterPosition.x }, 100);
        }
        _playAnimation();
        
        const value = 10;
        const ratio = (1 + (0.5 - Math.random()));
        return {
            type: 'damage',
            target: 'opponent',
            value: Math.floor(value * ratio),
            icon: this.iconBag.normal,
            dialog: getRandomDialog(this.dialogBag.attack),
        };

    }

    public characterHandler() {
        this.board.updateStatusBoard();
    }

}
