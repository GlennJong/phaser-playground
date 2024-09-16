import Phaser from 'phaser';
import { runTween } from '../../utils/runTween';
import { StatusBoard, TStatusBoardProps } from './StatusBoard';
import { Character } from '../../components/Character';

type TEffect = {
    type: 'damage' | 'recover',
    target: 'self' | 'opponent',
    value?: number,
    basic: number
}

type TAction = {
    icon: { key: string, frame: string },
    animation: 'attack' | 'damage' | 'recover' | { key: string },
    dialog: string[],
    effect?: TEffect
}

const opponentConfig: {
        actions: { [key: string]: TAction },
        reactions: { [key: string]: TAction }
    } = {
    actions: {
        attack: {
            icon: { key: 'battle_beibei', frame: 'face-normal' },
            animation: 'attack',
            dialog: [ 'attack_1', 'attack_2' ],
            effect: { type: 'damage', target: 'self', basic: 10 },
        },
        sp: {
            icon: { key: 'battle_beibei', frame: 'face-attack' },
            animation: { key: 'sp' },
            dialog: [ 'sp_1', 'sp_2' ],
            effect: { type: 'recover', target: 'self', basic: 10 },
        },
    },
    reactions: {
        damage: {
            icon: { key: 'battle_beibei', frame: 'face-damage' },
            animation: 'damage',
            dialog: [ 'damage_1', 'damage_2' ]
        },
        recover: {
            icon: { key: 'battle_beibei', frame: 'face-normal' },
            animation: 'recover',
            dialog: [ 'recover_1', 'recover_2' ]
        },
    }
}

const selfConfig: {
        actions: { [key: string]: TAction },
        reactions: { [key: string]: TAction }
    } = {
    actions: {
        attack: {
            icon: { key: 'battle_afk', frame: 'face-normal' },
            animation: 'attack',
            dialog: [ 'attack_1', 'attack_2' ],
            effect: { type: 'damage', target: 'opponent', basic: 10 },
        },
        sp: {
            icon: { key: 'battle_afk', frame: 'face-attack' },
            animation: 'attack',
            dialog: [ 'sp_1', 'sp_2' ],
            effect: { type: 'damage', target: 'opponent', basic: 10 },
        },
    },
    reactions: {
        damage: {
            icon: { key: 'battle_afk', frame: 'face-damage' },
            animation: 'damage',
            dialog: [ 'damage_1', 'damage_2' ]
        },
        recover: {
            icon: { key: 'battle_afk', frame: 'face-normal' },
            animation: 'recover',
            dialog: [ 'recover_1', 'recover_2' ]
        },
    }
}


function getRandomRatio(): number {
    return 1 + (0.5 - Math.random());
}

const fullWidth = 160;

const defaultCharacterPosition = {
    self: { x: 30, y: 90, },
    opponent: { x: 130, y: 36 },
};

const defaultStatusBoardPosition = {
    self: { x: 110, y: 80 },
    opponent: { x: 50, y: 20 }
};

function getRandomDialog(data: string[]) {
    return data[Math.floor(Math.random() * data.length)];
}

export default class BattleCharacter extends Character
{
    public board: StatusBoard;
    private currentHp: number;
    private actions: { [key: string]: TAction };
    private reactions: { [key: string]: TAction };
    private role: 'self' | 'opponent';
    public options: string[];

    constructor (
        scene: Phaser.Scene,
        key: string,
        role: 'self' | 'opponent',
        data: TStatusBoardProps,
    )
    {
        // step2: create Character instance
        super(
            scene,
            key,
            defaultCharacterPosition[role]
        );

        // step3: define current hp
        this.currentHp = data.hp;
        
        // step4: define current action
        this.role = role;
        
        // step5: define config
        const config = role === 'self' ? selfConfig : opponentConfig;
        this.options = Object.keys(config.actions);
        this.actions = config.actions;
        this.reactions = config.reactions;
        
        // step6: set default character status board and character animation
        const boardPosition = defaultStatusBoardPosition[role];
        this.board = new StatusBoard(scene, boardPosition.x, boardPosition.y, data);
        this.playAnimation(role === 'self' ? 'self-idle': 'idle');

    }

    public async openingCharacter() {
        const position = defaultCharacterPosition[this.role];
        const distance = this.role === 'self' ? fullWidth : fullWidth  * -1;

        this.character.setPosition(position.x + distance, position.y)
        await runTween(this.character, { x: position.x }, 1000);
    }

    private handlePlayKeyFrameAnimation = async (key: string) => {
        await this.playAnimation(key, 1000);
        this.playAnimation('idle');
    }

    private handlePlayAttackReaction = async () => {
        const distance = this.role === 'self' ? 10 : -10;
        const position = defaultCharacterPosition[this.role];
        
        await runTween(this.character, { x: position.x + distance }, 100);
        await runTween(this.character, { x: position.x }, 100);
        this.playAnimation('beibei-idle');
    }

    public runAction(action = 'sp') {
        const currentAction = this.actions[action];

        if (!currentAction) return;

        const { animation, dialog, effect } = currentAction;
        
        // Run key frame animation
        if (typeof animation !== 'string' && animation.key) {
            this.handlePlayKeyFrameAnimation(animation.key);
        }
        else if (animation === 'attack') {
            this.handlePlayAttackReaction();
        }

        if (effect) {
            effect.value = Math.floor(effect.basic * getRandomRatio());
        }
        
        return { 
            ...currentAction,
            dialog: getRandomDialog(dialog),
         };
    }


    private handlePlayDamageReaction = async (value: number) => {
        function easeInOutCubic(x: number): number {
            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        }
        await runTween(this.character, { alpha: 0, repeat: 3 }, 100, easeInOutCubic);
        this.character.setAlpha(1);
        await this.board.decreaseHP(value);
    }
    
    private handlePlayRecoverReaction = async (value: number) => {
        await runTween(this.character, { scale: 1.15, yoyo: 1 }, 200);
        this.character.setScale(1);
        await this.board.decreaseHP(value * -1);
    }

    public runReaction(reaction = 'damage', value: number) {
        const currentReaction = this.reactions[reaction];

        if (!currentReaction) return;

        const { animation, dialog } = currentReaction;
        
        // Run key frame animation
        if (typeof animation !== 'string' && animation.key) {
            this.handlePlayKeyFrameAnimation(animation.key);
        }
        if (animation === 'damage') {
            this.handlePlayDamageReaction(value);
        }
        else if (animation === 'recover') {
            this.handlePlayRecoverReaction(value);
        }
        
        return { 
            ...currentReaction,
            dialog: getRandomDialog(dialog),
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


    public characterHandler() {
        this.board.updateStatusBoard();
    }

}
