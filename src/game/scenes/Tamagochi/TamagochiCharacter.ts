import Phaser from "phaser";
import { Character, CharacterProps } from "../../components/Character";
import { canvas } from "../../constants";

type TDirection = "none" | "left" | "right";

type TSpecialAction = "none" | "sleep";

type TStatus = {
    [key: string]: number,
}
const defaultIdleaction = 'idle-left';

const moveDistance = 32;

export class TamagochiCharacter extends Character {
    private isActing: boolean = false;
    private spaceEdge: { from: number, to: number };

    public status: TStatus = {
        hp: 100,
        mp: 100
    };

    constructor(
        scene: Phaser.Scene,
        props: CharacterProps,
        edge: { from: number, to: number },
    ) {
        super(scene, props);

        // define moving limitation
        this.spaceEdge = edge || { from: 0, to: canvas.width } 

        // default animation
        this.playAnimation(defaultIdleaction);
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
        const options: TSpecialAction[] = ['sleep', 'none'];
        const action = options[Math.floor(Math.random() * options.length)];
        if (action !== 'none') {

            // start animation;
            this.isActing = true;
            await this.playAnimation(action);
            
            // reset animation;
            this.isActing = false;
            this.playAnimation(defaultIdleaction);
        }
    }

    private handleDecreaseHealth() {
        this.status.hp -= 20;
        this.handleDetectCharacterDisabled();
    }

    private handleDetectCharacterDisabled() {
        if (this.isActing) return;
        if (this.status.hp <= 0) {
            this.playAnimation('disable');
        }
        else {
            this.playAnimation(defaultIdleaction);
        }
    }
    
    private fireEach5sec?: number = undefined;
    
    public characterHandler(time: number) {
        
        // update position trigger at every frame
        // TODO: make sure action activity could update frequently
        if (this.isActing) {
            this.updatePosition();
        }

        // run handler every 5 secs
        if (Math.floor(time/1000)%5 === 0) {
             // prevent trigger by each frames in every 5 secs
            if (Math.floor(time/1000)/5 == this.fireEach5sec) return;

            // update fireEach5sec value;
            this.fireEach5sec = Math.floor(time/1000)/5; 

            // handle status caculation each 1 min
            if (this.fireEach5sec % 12 === 0) {
                this.handleDecreaseHealth();
            }
            
            if (this.status.hp > 0) { // stop all of following action without hp
                
                // walk or idle each 5 secs
                if (this.fireEach5sec % 5 !== 0) {
                    this.handleNormalMoveAction();
                }
                // special action each 25 secs
                else if (this.fireEach5sec % 5 === 0) {
                    this.handleSpecialAction();
                }
            }

            // choose the animation display after all handler
            this.handleDetectCharacterDisabled();
        }

    }
}

