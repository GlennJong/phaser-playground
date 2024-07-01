import Phaser from "phaser";

type TDirection = "none" | "left" | "right" | "top" | "down";

export class Character extends Phaser.GameObjects.Container {
    private character: Phaser.GameObjects.Sprite;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
    ) {
        super(scene);
        this.scene = scene;

        // idle animation
        this.scene.anims.create({
            key: "idle-left",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "idle-left_",
                end: 1,
            }),
            frameRate: 2,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "idle-right",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "idle-right_",
                end: 1,
            }),
            frameRate: 2,
            repeat: -1,
        });

        // walk
        this.scene.anims.create({
            key: "walk-left",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "walk-left_",
                end: 1,
            }),
            frameRate: 4,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "walk-right",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "walk-right_",
                end: 1,
            }),
            frameRate: 4,
            repeat: -1,
        });


        // activities
        this.scene.anims.create({
            key: "sleep",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "sleep_",
                end: 1,
            }),
            frameRate: 2,
            repeat: -1,
        });

        // create character
        this.character = this.scene.add.sprite(x, y, key).setScale(1);
        this.character.play("idle-left"); // default animation

        this.character.on('animationcomplete', (e) => {
            console.log(e)
        })

        this.add(this.character);
        this.scene.add.existing(this);
    }
    
    // private currentActivity?: string;
    public doActivity(activity) {
        this.character.play(activity);
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

