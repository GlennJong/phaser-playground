import Phaser from 'phaser';
import { runTween } from '../../utils/runTween';
import { StatusBoard, TStatusBoardProps } from './StatusBoard';
import { CharacterProps, Character } from '../../components/Character';

const fullWidth = 160;

const defaultCharacterPosition = {
  x: 130,
  y: 36,
};
const defaultStatusBoardPosition = {
  x: 50, y: 20
};

export default class BattleOpponentCharacter extends Character
{
    public board: StatusBoard;
    private currentHp: number;

    constructor (
        scene: Phaser.Scene,
        props: CharacterProps,
        data: TStatusBoardProps,
    )
    {
        // step2: create Character instance
        super(
            scene,
            {
                ...defaultCharacterPosition,
                ...props
            }
        );

        // step3: define current hp
        this.currentHp = data.hp;
        
        // step3: set default character animation
        const temp: Phaser.Types.Animations.Animation = {
            key: 'beibei-idle',
            frames: scene.anims.generateFrameNames('battle_beibei', { prefix: `idle_`, start: 1, end: 9 }),
            repeat: -1,
            frameRate: 8,
            repeatDelay: 1000,
        };
        const temp2: Phaser.Types.Animations.Animation = {
            key: 'beibei-sp',
            frames: scene.anims.generateFrameNames('battle_beibei', { prefix: `sp_`, start: 1, end: 5 }),
            repeat: 0,
            frameRate: 8,
        };
        // if (_ani.freq)     data.frameRate = _ani.freq;
        // if (_ani.duration) data.duration = _ani.duration;
        
        scene.anims.create(temp);
        scene.anims.create(temp2);
        
        this.playAnimation('beibei-idle');
        

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
        // do suffering damage animation

        // end battle if hp is 0
        return this.currentHp <= 0;
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
            await this.playAnimation('beibei-sp', 1000);
            this.playAnimation('beibei-idle');
        }
        _playAnimation();

        const value = 20;
        const ratio = (1 + (0.5 - Math.random()));
        return { type: 'recover', target: 'self', value: Math.floor(value * ratio) };
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
        return { type: 'damage', target: 'self', value: Math.floor(value * ratio) };

    }

    public characterHandler() {
        this.board.updateStatusBoard();
    }

}
