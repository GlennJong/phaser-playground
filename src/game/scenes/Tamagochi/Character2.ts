import Phaser from "phaser";

type TDirection = "none" | "left" | "right" | "top" | "down";


const animsConfig = [
    { key: 'idle-left' },
    { key: 'idle-right' },
    { key: 'walk-left' },
    { key: 'walk-right' },
    { key: 'sleep'}
]

type TStatus = {
    [key: string]: number,
}

export class Character extends Phaser.GameObjects.Container {
    private character: Phaser.GameObjects.Sprite;
    private status: TStatus;
    
    
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
    ) {
        super(scene);
        // scene = scene;

        // idle animation
        scene.anims.create({
            key: "idle-left",
            frames: scene.anims.generateFrameNames(key, {
                prefix: "idle-left_",
                end: 1,
            }),
            frameRate: 2,
            repeat: -1,
        });
        scene.anims.create({
            key: "idle-right",
            frames: scene.anims.generateFrameNames(key, {
                prefix: "idle-right_",
                end: 1,
            }),
            frameRate: 2,
            repeat: -1,
        });

        // walk
        scene.anims.create({
            key: "walk-left",
            frames: scene.anims.generateFrameNames(key, {
                prefix: "walk-left_",
                end: 1,
            }),
            frameRate: 16,
            repeat: -1,
        });
        scene.anims.create({
            key: "walk-right",
            frames: scene.anims.generateFrameNames(key, {
                prefix: "walk-right_",
                end: 1,
            }),
            frameRate: 16,
            repeat: -1,
        });


        // activities
        scene.anims.create({
            key: "sleep",
            frames: scene.anims.generateFrameNames(key, {
                prefix: "sleep_",
                end: 1,
            }),
            frameRate: 2,
            repeat: -1,
        });


        const status = {
            health: 100,
            hungry: 100,
        }
        
        const text = scene.make.text({
            x: 10,
            y: 10,
            text: `health: ${status.health}, hungry: ${status.hungry}`,
            style: { fontSize: '10px', color: '#000000', fontFamily: 'futura' }
        });

        // create character
        const character = scene.add.sprite(x, y, key).setScale(1);
        character.play("idle-left"); // default animation

        character.on('animationcomplete', (e) => {
            console.log(e)
        })

        this.status = status;
        this.text = text;
        this.add(character);
        this.add(text);
        this.character = character;
        
        // this.scene = scene;
        
        scene.add.existing(this);
    }
    
    // private currentActivity?: string;
    public doActivity(activity) {
        this.character.play(activity);
        
        // = scene.make.text({
        //     x: 10,
        //     y: 10,
        //     text: `health: ${status.health}, hungry: ${status.hungry}`,
        //     style: { fontSize: '10px', color: '#000000', fontFamily: 'futura' }
        // });
    }

    // movement status
    private currentMovement?: {
        direction: TDirection,
        from: { x: number, y: number }
        to: { x: number, y: number }
    };
    private currentMovingFrame = { total: 60, count: 0 };

    // moving
    public moveDirection(direction: TDirection, distance: number) {
        if (!this.currentMovement) {
            let x = this.character.x, y = this.character.y;

            if (direction === 'left') { x -= distance }
            else if (direction === 'right') { x += distance }
            else if (direction === 'top') { y -= distance }
            else if (direction === 'down') { y += distance }

            this.character.play(`walk-${direction}`);

            this.currentMovement = {
                direction,
                from: { x: this.character.x, y: this.character.y },
                to: { x, y }
            }
        }
    }

    public updateStatus() {
        if (this.status.hungry > 0) {
            this.status.hungry -= Math.floor(Math.random() * 10);
            this.text.text = 
                `health: ${this.status.health}, hungry: ${this.status.hungry} ${this.status.hungry === 0 ? 'Death!' : ''}`;
        }
    }

    public updatePosition(): void {
        if (this.currentMovement) {
            // Start count the frames
            this.currentMovingFrame.count += 1;

            // movement
            const { direction, from, to } = this.currentMovement;
            const { total, count } = this.currentMovingFrame;

            this.character.setPosition(
                from.x + ((to.x - from.x) * count/total),
                from.y + ((to.y - from.y) * count/total),
            );

            if (total == count) {
                this.character.setPosition(to.x, to.y);
                this.character.play(`idle-${direction}`);

                // reset
                this.currentMovement = undefined;
                this.currentMovingFrame.count = 0;
            }
        }
        
    }
}

