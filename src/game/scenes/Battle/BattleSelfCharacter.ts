import Phaser from 'phaser';
import { runTween } from '../../utils/runTween';
import { StatusBoard, TStatusBoardProps } from './StatusBoard';
import { CharacterProps, Character } from '../../components/Character';

const fullWidth = 160;

const defaultCharacterPosition = {
    x: 30, y: 90
}

const defaultStatusBoardPosition = {
    x: 110, y: 80
}

export default class BattleSelfCharacter extends Character
{
    public board: StatusBoard;
    private currentHp: number;

    constructor (
        scene: Phaser.Scene,
        props: CharacterProps,
        data: TStatusBoardProps,
    )
    {
        super(
            scene,
            {
                ...defaultCharacterPosition,
                ...props
            }
        );

        this.currentHp = data.hp;

        const temp: Phaser.Types.Animations.Animation = {
            key: 'afk-self-idle',
            frames: scene.anims.generateFrameNames('battle_afk', { prefix: `self-idle_`, start: 1, end: 2 }),
            repeat: -1,
            frameRate: 1,
            repeatDelay: 1000,
        };
        // if (_ani.freq)     data.frameRate = _ani.freq;
        // if (_ani.duration) data.duration = _ani.duration;
        
        scene.anims.create(temp);
        
        
        this.playAnimation('afk-self-idle');

        this.board = new StatusBoard(scene, defaultStatusBoardPosition.x, defaultStatusBoardPosition.y, data);

    }

    public async openingCharacter() {
        this.character.setPosition(defaultCharacterPosition.x + fullWidth, defaultCharacterPosition.y)
        await runTween(this.character, { x: defaultCharacterPosition.x }, 1000);
    }

    public async getDamage(value: number) {
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

        // end battle if hp is 0
        return this.currentHp <= 0;
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
        return this.currentHp <= 0;
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
        return { type: 'damage', target: 'self', value: Math.floor(value * ratio) };
    }

    public attack() {
        const _playAnimation = async () => {
            await runTween(this.character, { x: defaultCharacterPosition.x + 10 }, 100);
            await runTween(this.character, { x: defaultCharacterPosition.x }, 100);
        }
        _playAnimation();
        
        const value = 10;
        const ratio = (1 + (0.5 - Math.random()));
        return { type: 'damage', target: 'self', value: Math.floor(value * ratio) };

    }

    public characterHandler() {
        this.board.updateStatusBoard();
    }

}
