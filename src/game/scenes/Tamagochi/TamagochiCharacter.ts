import Phaser from "phaser";
import { Character } from './Character';


type TDirection = "none" | "left" | "right";

type TSpecialMovement = "none" | "sleep";

type TStatus = {
    [key: string]: number,
}
const defaultIdleMovement = 'idle-left';

export class TamagochiCharacter extends Character {
    private currentMovement: string = 'idle';
    private isMoving: boolean = false;

    private status: TStatus = {
        hp: 100,
        mp: 100
    };

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
    ) {
        super(scene, x, y, key);

        // default animation
        this.character.play("idle-left"); 
    }

    private handleNormalMovement() {
        if (!this.currentMovement.includes('idle')) return;
        const options: TDirection[] = ['left', 'right', 'none'];
        const direction = options[Math.floor(Math.random() * options.length)];
        if (direction !== 'none') {
            this.isMoving = true;
            // this.currentDirection = direction;
            this.character.play(`walk-${direction}`);
            this.moveDirection(direction, 32, () => {
                this.isMoving = false;
                this.character.play(`idle-${direction}`);
            });
        }
    }
    
    private handleSpecialMovement() {
        if (!this.currentMovement.includes('idle')) return;
        const options: TSpecialMovement[] = ['sleep', 'none'];
        const movement = options[Math.floor(Math.random() * options.length)];
        if (movement !== 'none') {
            this.currentMovement = movement;
            this.character.play(movement);
        }
    }

    private handleDecreaseHealth() {
        this.status.hp -= 1;
        if (this.status.hp <= 0) {
            this.currentMovement = 'disabled';
        }
    }

    private handlePlayCharacterAnimation() {
        const moveIsFinish = true;
        if (moveIsFinish) {
            this.currentMovement = 'idle';
            this.character.play(defaultIdleMovement);
        }
        this.character.play(this.currentMovement);
    }
    
    private fireEach5sec?: number = undefined;
    
    public characterHandler(time: number) {
        
        // update position trigger at every frame
        // TODO: make sure movement activity could update frequently
        if (this.isMoving) {
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
            
            if (this.status.hp > 0) { // stop all of following movement without hp
                
                // walk or idle each 5 secs
                if (this.fireEach5sec % 5 !== 0) {
                    this.handleNormalMovement();
                }
                // special movement each 25 secs
                else if (this.fireEach5sec % 5 === 0) {
                    // this.handleSpecialMovement();
                }
            }

            // choose the animation display after all handler
            // this.handlePlayCharacterAnimation();
        }

    }
}

