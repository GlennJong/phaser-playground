import Phaser from 'phaser';
import { runTween } from '../../utils/runTween';
import { StatusBoard } from './StatusBoard';
import { Character } from '../../components/Character';
import { TDialogData } from '../../components/PrimaryDialogue';
import { selectFromPiority } from '../../utils/selectFromPiority';


type TDialogItem = {
    piority: number,
    dialog: TDialogData[]
}

export type TEffect = {
    type: 'damage' | 'recover',
    target: 'self' | 'opponent',
    value?: number,
    basic: number
}

type TReaction = {
    animation: 'damage' | 'recover' | { key: string },
    dialogs: TDialogItem[],
};

type TAction = {
    animation: 'attack' | { key: string },
    dialogs: TDialogItem[],
    piority: number,
    effect: TEffect
};

type TResult = {
    icon: { key: string, frame: string },
    dialogs: TDialogItem[],
};

export type TRunAction = {
    dialog: TDialogData[],
} & TAction;

export type TRunReaction = {
    dialog: TDialogData[],
    isDead: boolean
} & TReaction;

export type TRunResult = {
    dialog: TDialogData[],
} & TResult;


// const opponentConfig: {
//         base: TBase,
//         actions: { [key: string]: TAction },
//         reactions: { [key: string]: TReaction },
//         results: { [key: string]: TResult }
//     } = {
//     base: {
//         max_hp: 60,
//         name: '貝貝'
//     },
//     actions: {
//         attack: {
//             icon: { key: 'battle_beibei', frame: 'face-normal' },
//             animation: 'attack',
//             piority: 80,
//             dialogs: [ '吃我的貝貝飛踢攻擊！', '打你！' ],
//             effect: { type: 'damage', target: 'self', basic: 20 },
//         },
//         sp1: {
//             icon: { key: 'battle_beibei', frame: 'face-attack' },
//             animation: { key: 'sp' },
//             piority: 20,
//             dialogs: [ '貝貝的治療飛吻！', '啾～～～' ],
//             effect: { type: 'recover', target: 'self', basic: 10 },
//         },
//         sp2: {
//             icon: { key: 'battle_beibei', frame: 'face-attack' },
//             animation: { key: 'sp' },
//             piority: 20,
//             dialogs: [ '貝貝的殺人飛吻！', '啾！！！！！' ],
//             effect: { type: 'damage', target: 'self', basic: 30 },
//         },
//     },
//     reactions: {
//         damage: {
//             icon: { key: 'battle_beibei', frame: 'face-damage' },
//             animation: 'damage',
//             dialogs: [ '你幹嘛打我啦！', '好痛啦！' ]
//         },
//         recover: {
//             icon: { key: 'battle_beibei', frame: 'face-normal' },
//             animation: 'recover',
//             dialogs: [ '貝貝復活！' ]
//         },
//     },
//     results: {
//         win: {
//             icon: { key: 'battle_beibei', frame: 'face-normal' },
//             dialogs: [ '想跟我貝貝打架你還早十年呢！！！！', '貝貝的勝利！' ]
//         },
//         lose: {
//             icon: { key: 'battle_beibei', frame: 'face-damage' },
//             dialogs: [ '我輸惹...', '好不甘心...' ]
//         }
//     }
// }

// const selfConfig: {
//         base: TBase,
//         actions: { [key: string]: TAction },
//         reactions: { [key: string]: TReaction },
//         results: { [key: string]: TResult }
//     } = {
//     base: {
//         max_hp: 100,
//         name: 'AFK君'
//     },
//     actions: {
//         attack: {
//             icon: { key: 'battle_afk', frame: 'face-normal' },
//             animation: 'attack',
//             piority: 80,
//             dialogs: [ '普通衝撞攻擊！', '普通拍擊！' ],
//             effect: { type: 'damage', target: 'opponent', basic: 20 },
//         },
//         sp: {
//             icon: { key: 'battle_afk', frame: 'face-attack' },
//             animation: 'attack',
//             piority: 80,
//             dialogs: [ '特殊衝撞攻擊！', '特殊拍擊！' ],
//             effect: { type: 'damage', target: 'opponent', basic: 40 },
//         },
//     },
//     reactions: {
//         damage: {
//             icon: { key: 'battle_afk', frame: 'face-damage' },
//             animation: 'damage',
//             dialogs: [ '啊～～～', '好痛！！' ]
//         },
//         recover: {
//             icon: { key: 'battle_afk', frame: 'face-normal' },
//             animation: 'recover',
//             dialogs: [ '恢復了一點點生命:)', '復活了:)' ]
//         },
//     },
//     results: {
//         win: {
//             icon: { key: 'battle_afk', frame: 'face-normal' },
//             dialogs: [ '好耶！我贏了！', 'AFK君的勝利，嘻嘻！' ]
//         },
//         lose: {
//             icon: { key: 'battle_afk', frame: 'face-damage' },
//             dialogs: [ '是我輸ㄌ', '哭哭哭' ]
//         }
//     }
// }

const fullWidth = 160;

const defaultCharacterPosition = {
    self: { x: 30, y: 90, },
    opponent: { x: 130, y: 36 },
};

const defaultStatusBoardPosition = {
    self: { x: 110, y: 80 },
    opponent: { x: 50, y: 20 }
};

export default class BattleCharacter extends Character
{
    public currentHp: number;
    public hp: { current: number, max: number } = { current: 0, max: 0 };
    private actions: { [key: string]: TAction };
    private reactions: { [key: string]: TReaction };
    private results: { [key: string]: TResult };
    private role: 'self' | 'opponent';
    public board: StatusBoard;
    public avaliableActions: string[];
    
    constructor (
        scene: Phaser.Scene,
        key: string,
        role: 'self' | 'opponent',
        data: { hp?: number },
    )
    {
        // get current character config
        const currentBattleCharacterConfig = scene.cache.json.get('battle_character')[key] || scene.cache.json.get('battle_character')['default'];
        
        if (!currentBattleCharacterConfig) return;
        
        const { animations, battle } = currentBattleCharacterConfig;

        const characterProps = {
            ...defaultCharacterPosition[role],
            animations: animations
        };

        super(
            scene,
            key,
            characterProps,
        );

        // step3: define role
        this.role = role;

        // step4: define config
        // const config = role === 'self' ? selfConfig : opponentConfig;
        this.avaliableActions = Object.keys(battle.actions);
        this.actions = battle.actions;
        this.reactions = battle.reactions;
        this.results = battle.results;
        
        // step5: define current action
        this.hp = {
            current: typeof data.hp !== 'undefined' ? data.hp : battle.base.max_hp,
            max: battle.base.max_hp
        };
        
        // step6: set default character status board and character animation
        const { name } = battle.base;
        const boardPosition = defaultStatusBoardPosition[role];
        this.board = new StatusBoard(
            scene,
            boardPosition.x,
            boardPosition.y,
            { hp: { current: this.hp.current, max: this.hp.max }, name }
        );

        this.playAnimation('idle');

        this.getRandomAction();

    }

    public async openingCharacter() {
        const position = defaultCharacterPosition[this.role];
        const distance = this.role === 'self' ? fullWidth : fullWidth  * -1;

        this.character.setPosition(position.x + distance, position.y)
        await runTween(this.character, { x: position.x }, 1000);
    }

    private handlePlayKeyFrameAnimation = async (key: string) => {
        await this.board.setAlpha(0);
        await this.playAnimation(key, 1000);
        this.playAnimation('idle');
        await this.board.setAlpha(1);
    }

    private handlePlayAttackReaction = async () => {
        const distance = this.role === 'self' ? 10 : -10;
        const position = defaultCharacterPosition[this.role];
        
        await this.board.setAlpha(0);
        await runTween(this.character, { x: position.x + distance }, 200);
        await runTween(this.character, { x: position.x }, 200);
        await this.board.setAlpha(1);
    }

    public runAction(action = 'sp'): TRunAction | undefined {
        const currentAction = this.actions[action];

        if (!currentAction) return;

        const { animation, dialogs } = currentAction;
        
        // Run key frame animation
        if (typeof animation !== 'string' && animation.key) {
            this.handlePlayKeyFrameAnimation(animation.key);
        }
        else if (animation === 'attack') {
            this.handlePlayAttackReaction();
        }

        // if (effect) {
        //     effect.value = Math.floor(effect.basic);
        // }

        console.log({ dialogs })
        
        return { 
            ...currentAction,
            dialog: selectFromPiority(dialogs).dialog,
         };
    }


    private handlePlayDamageReaction = async (value: number) => {
        function easeInOutCubic(x: number): number {
            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        }
        const result = Math.max(0, this.hp.current - value);
        this.hp.current = result;
        await runTween(this.character, { alpha: 0, repeat: 3 }, 100, easeInOutCubic);
        this.character.setAlpha(1);
        await this.board.setHP(this.hp.current);
    }
    
    private handlePlayRecoverReaction = async (value: number) => {
        const result = Math.min(this.hp.max, this.hp.current + value);
        this.hp.current = result;
        await runTween(this.character, { scale: 1.15, yoyo: 1 }, 200);
        this.character.setScale(1);
        await this.board.setHP(this.hp.current);
    }

    public runReaction(reaction = 'damage', value: number): TRunReaction | undefined {
        const currentReaction = this.reactions[reaction];

        if (!currentReaction) return;

        const { animation, dialogs } = currentReaction;
        
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
            dialog: selectFromPiority(dialogs).dialog,
            isDead: this.hp.current <= 0
         };
    }

    public runResult(action: string): TRunResult | undefined {
        const currentResult = this.results[action];
        if (!currentResult) return;
        
        if (action === 'lose') {
            this.setAlpha(0.5);
        }
        this.board.setAlpha(0);

        const { dialogs } = currentResult;
        
        return {
            ...currentResult,
            dialog: selectFromPiority(dialogs).dialog,
        };
    }

    public getRandomAction() {
        const allAction = Object.keys(this.actions);
        let sumPiority = 0;

        const allActionPoint: { [key: string]: number } = {};

        allAction.forEach(key => {
            allActionPoint[key] = sumPiority += this.actions[key].piority;
        });

        const randomPoint = sumPiority * Math.random();

        allAction.forEach(key => {
            allActionPoint[key] = Math.abs(allActionPoint[key] - randomPoint);
        });

        const closestPoint = Math.min(...Object.values(allActionPoint));
        const selectedAction = Object.keys(allActionPoint).find(key => allActionPoint[key] === closestPoint);

        return selectedAction;
    }


    public characterHandler() {
        this.board.updateStatusBoard();
    }

}
