import Phaser from "phaser";
import { Character, CharacterProps } from "../../components/Character";
import { canvas } from "../../constants";

type TDirection = "none" | "left" | "right";
type TSpecialAction = string;
type TStatus = { [key: string]: number };

const defaultIdleAction = 'idle-left'; // TODO: idle right
const defaultRecoverHpByTime = 24;
const defaultDecreaseHpByTime = 1;

// TODO: low hp status...
const moveDistance = 32;

export class TamagotchiCharacter extends Character {
    private isAlive: boolean = true;
    private isBorn: boolean = false;
    private isActing: boolean = false;
    private spaceEdge: { from: number, to: number };
    private callbackFunctions: { [key: string]: (param: any) => any};

    public status: TStatus = {
        hp: 100,
        mp: 100
    };

    constructor(
        scene: Phaser.Scene,
        props: CharacterProps,
        edge: { from: number, to: number },
        callbackFunctions: any,
    ) {
        super(scene, props);

        // define moving limitation
        this.spaceEdge = edge || { from: 0, to: canvas.width } 

        // default animation
        this.playAnimation(defaultIdleAction);

        // defined callback function
        this.callbackFunctions = callbackFunctions;
    }

    private async handleBornAction() {
        this.isActing = true;
        await this.playAnimation('born');
        this.isActing = false;
        this.isBorn = false;
    }

    private handleNormalMoveAction() {
        // stop move action if character is acting
        if (this.isActing) return;
        
        const options: TDirection[] = ['left', 'right', 'none'];
        let direction = options[Math.floor(Math.random() * options.length)];
        
        if (direction !== 'none') {
            // change direction if character close to edge
            direction = this.character.x < this.spaceEdge.from ? 'right' : this.character.x > this.spaceEdge.to ? 'left' : direction;
            this.isActing = true;
            this.playAnimation(`walk-${direction}`);
            this.moveDirection(direction, moveDistance, () => {

                // reset action after moved
                this.isActing = false;
                this.playAnimation(`idle-${direction}`);
            });
        }
    }
    
    private async handleSpecialAction() {
        if (this.isActing) return;
        const options: TSpecialAction[] = ['sp-1-left', 'none'];
        const action = options[Math.floor(Math.random() * options.length)];
        // console.log(this.moveDirection)
        
        if (action !== 'none') {

            // start animation;
            this.isActing = true;
            await this.playAnimation(action);
            // await this.playAnimation(`${action}-${this.moveDirection}`);
            
            // reset animation;
            this.isActing = false;
            this.playAnimation(defaultIdleAction);
        }
    }

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
    
    private x: number = 2;
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
            this.playAnimation(`idle-${direction}`);
        });
    }

    public async manualContolAction(action: 'sleep') {
        if (this.isActing) return;
        
        // start animation;
        this.isActing = true;
        await this.playAnimation(action);
        
        // reset animation;
        this.isActing = false;
        this.playAnimation(defaultIdleAction);
    }

    public async runFuntionalAction(action: string) {
        // TODO: set correct action pirority!
        if (!this.isAlive) return;
        const result = this.status.hp + 10;
        this.status.hp = result >= 100 ? 100 : result <= 0 ? 0: result;
        // console.log(this.status.hp);

        if (action === 'drink') {
            this.isActing = true;
            await this.playAnimation('drink');
            this.isActing = false;
            // this.playAnimation(defaultIdleAction);
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
    
    
    public characterHandler(time: number) {
        // update position trigger at every frame
        // TODO: make sure action activity could update frequently
        if (this.isActing) {
            this.updatePosition();
        }
        
        // run handler every x secs
        if (Math.floor(time/1000) % this.x === 0) {
             // prevent trigger by each frames in every x secs
            if (Math.floor(time/1000) / this.x == this.fireEachXsec) return;

            // update fireEachXsec value;
            this.fireEachXsec = Math.floor(time/1000) / this.x; 

            if (this.isAlive) {
                if (this.isBorn) {
                    this.handleBornAction();
                }

                this.handleDecreaseHpByTime();

                // walk or idle each 5 secs
                if (this.fireEachXsec % this.x !== 0) {
                    this.handleNormalMoveAction();
                }
                // special action each 25 secs
                else if (this.fireEachXsec % this.x === 0) {
                    this.handleSpecialAction();
                }

            }
            else {
                this.handleRecoverHp();
                this.handleEggAction();
            }
        }
    }
}

