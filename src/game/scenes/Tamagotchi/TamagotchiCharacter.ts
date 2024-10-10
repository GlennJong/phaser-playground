import Phaser from "phaser";
import { Character, CharacterProps } from "../../components/Character";
import { canvas } from "../../constants";

type TDirection = "none" | "left" | "right";

type TAction = {
    icon: { key: string, frame: string },
    animation: { key: string },
    dialogs: string[],
    piority: number,
};


// type TSpecialAction = string;
type TStatus = { [key: string]: number };
type TamagotchiCharacterProps = CharacterProps & {
    edge: { from: number, to: number },
    callbackFunctions: { [key: string]: <T extends number>(props: T) => void },
    hp?: number
};

const defaultIdlePrefix = 'idle'; // TODO: idle right
const defaultHp = 100;
const defaultRecoverHpByTime = 24;
const defaultDecreaseHpByTime = 1;

const defaultXSecForNormalAction = 2;
const defaultXSecForSpecialAction = 10;


// TODO: low hp status...
const moveDistance = 32;

export class TamagotchiCharacter extends Character {
    private isAlive: boolean = true;
    private isBorn: boolean = false;
    private isActing: boolean = false;
    private actions: { [key: string]: TAction };
    private spaceEdge: { from: number, to: number };
    private callbackFunctions: { [key: string]: <T extends number>(value: T) => void };
    private direction: TDirection = 'left';

    // TODO: direction state
    public status: TStatus = {
        hp: 100,
        mp: 100
    };

    constructor(
        scene: Phaser.Scene,
        props: TamagotchiCharacterProps,
    ) {

        // static character here
        const key = 'tamagotchi_afk';
        
        // get current character config
        const { tamagotchi_afk } = scene.cache.json.get('battle_character');

        const characterProps = {
            ...props,
            animations: tamagotchi_afk.animations
        };
        
        super(
            scene,
            key,
            characterProps,
        );
        
        const { hp, callbackFunctions } = props;
        
        // actions
        this.actions = tamagotchi_afk.idle_actions;
        
        // temp
        this.status.hp = hp || defaultHp;

        // define moving limitation
        this.spaceEdge = props.edge || { from: 0, to: canvas.width } 

        // default animation
        this.handleDefaultIdleAction();

        // defined callback function
        this.callbackFunctions = callbackFunctions;
    }

    private handleDefaultIdleAction() {
        if (this.isActing) return;
        this.playAnimation(`${defaultIdlePrefix}-${this.direction}`);
    }

    private async handleBornAction() {
        this.isActing = true;
        await this.playAnimation('born');
        this.isActing = false;
        this.isBorn = false;
    }

    
    // private handleNormalMoveAction() {
    //     // stop move action if character is acting
    //     if (this.isActing) return;
        
    //     const options: TDirection[] = ['left', 'right', 'none'];
    //     const result = options[Math.floor(Math.random() * options.length)];
        
    //     if (result !== 'none') {
    //         // change direction if character close to edge
    //         this.direction = this.character.x < this.spaceEdge.from ? 'right' : this.character.x > this.spaceEdge.to ? 'left' : result;

    //         this.isActing = true;
    //         this.playAnimation(`walk-${this.direction}`);
    //         this.moveDirection(this.direction, moveDistance, () => {

    //             // reset action after moved
    //             this.isActing = false;
    //             this.handleDefaultIdleAction();
    //         });
    //     }
    // }


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
        const selectedActionKey = Object.keys(allActionPoint).find(key => allActionPoint[key] === closestPoint);

        if (typeof selectedActionKey !== 'undefined') {
            return this.actions[selectedActionKey];
        }
    }

    
    private async handleAction() {
        if (this.isActing) return;

        const currentAction = this.getRandomAction();
        console.log(currentAction);
        // const options: TSpecialAction[] = ['stare-left', 'none'];
        // const action = options[Math.floor(Math.random() * options.length)];
        
        // if (action !== 'none') {

            // start animation;
            // this.isActing = true;
            // await this.playAnimation(action);
            // await this.playAnimation(`${action}-${this.moveDirection}`);
            
            // reset animation;
            // this.isActing = false;
            // this.handleDefaultIdleAction();
        // }
    }
    // private async handleSpecialAction() {
    //     if (this.isActing) return;

    //     // const 
    //     const options: TSpecialAction[] = ['stare-left', 'none'];
    //     const action = options[Math.floor(Math.random() * options.length)];
        
    //     if (action !== 'none') {

    //         // start animation;
    //         this.isActing = true;
    //         await this.playAnimation(action);
    //         // await this.playAnimation(`${action}-${this.moveDirection}`);
            
    //         // reset animation;
    //         this.isActing = false;
    //         this.handleDefaultIdleAction();
    //     }
    // }

    private async handleEggAction() {
        this.playAnimation('egg');
        this.isActing = false;
    }

    private handleRecoverHp() {
        const result = this.status.hp + defaultRecoverHpByTime;
        this.status.hp = result >= 100 ? 100 : result <= 0 ? 0: result;
        this.callbackFunctions.onHpChange(this.status.hp);
        this.handleDetectCharacterIsAlive();
    }

    private handleDecreaseHpByTime() {
        const result = this.status.hp - defaultDecreaseHpByTime;
        this.status.hp = result >= 100 ? 100 : result <= 0 ? 0: result;
        this.callbackFunctions.onHpChange(this.status.hp);
        this.handleDetectCharacterIsAlive();
    }

    private handleDetectCharacterIsAlive() {
        if (this.isAlive && this.status.hp <= 0) {
            this.isAlive = false;
        }
        else if (!this.isAlive && this.status.hp >= 100) {
            this.isAlive = true;
            this.isBorn = true;
        }
    }
    
    // private x: number = 2;
    private fireEachXsec?: number = undefined;
    
    public manualContolDirection(direction: 'left' | 'right' ) {
        if (this.isActing) return;
        
        // change direction if character close to edge
        direction = this.character.x < this.spaceEdge.from ? 'right' : this.character.x > this.spaceEdge.to ? 'left' : direction;
        this.isActing = true;
        this.playAnimation(`walk-${direction}`);
        this.moveDirection(direction, moveDistance, () => {

            // reset action after moved
            this.isActing = false;
            this.handleDefaultIdleAction();
        });
    }

    public async manualContolAction(action: 'sleep') {
        if (this.isActing) return;
        
        // start animation;
        this.isActing = true;
        await this.playAnimation(action);
        
        // reset animation;
        this.isActing = false;
        this.handleDefaultIdleAction();
    }

    public async runFuntionalAction(action: string) {
        // TODO: set correct action pirority!
        if (!this.isAlive) return;
        const result = this.status.hp + 10;
        this.status.hp = result >= 100 ? 100 : result <= 0 ? 0: result;

        if (action === 'drink') {
            this.isActing = true;
            await this.playAnimation('drink');
            this.isActing = false;
        }
        else if (action === 'write') {
            this.isActing = true;
            await this.playAnimation('write');
            this.isActing = false;
        }
        else if (action === 'sleep') {
            this.isActing = true;
            await this.playAnimation('lay-down');
            await this.playAnimation('sleep');
            this.isActing = false;
        }
    }
    

    private xSec = defaultXSecForNormalAction;
    private advancedXSec = Math.floor(defaultXSecForSpecialAction / defaultXSecForNormalAction);
    
    public characterHandler(time: number) {
        // update position trigger at every frame
        // TODO: make sure action activity could update frequently
        if (this.isActing) {
            this.updatePosition();
        }
        
        // run handler every x secs
        if (Math.floor(time/1000) % this.xSec === 0) {
             // prevent trigger by each frames in every x secs
            if (Math.floor(time/1000) / this.xSec == this.fireEachXsec) return;

            // update fireEachXsec value;
            this.fireEachXsec = Math.floor(time/1000) / this.xSec; 

            if (this.isAlive) {
                if (this.isBorn) {
                    this.handleBornAction();
                }

                this.handleDecreaseHpByTime();

                this.handleAction();

                if (this.fireEachXsec % (this.advancedXSec) === 0) {
                    // do special action when
                    // this.handleSpecialAction();
                }
                else {
                    // walk or idle each X secs
                    // this.handleNormalMoveAction();
                }

            }
            else {
                this.handleRecoverHp();
                this.handleEggAction();
            }
        }
    }
}

