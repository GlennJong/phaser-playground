import Phaser from "phaser";

type TDirection = "none" | "left" | "right" | "top" | "down";

export class Character extends Phaser.GameObjects.Container {
    public handleUpdate: (time: number) => void;
    private character: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
    ) {
        super(scene);

        this.scene = scene;

        // idle
        this.scene.anims.create({
            key: "idle-left",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "idle-left_",
                end: 2,
            }),
            frameRate: 4,
            repeat: -1,
        });
        this.scene.anims.create({
            key: "idle-right",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "idle-right_",
                end: 2,
            }),
            frameRate: 4,
            repeat: -1,
        });

        // walk
        this.scene.anims.create({
            key: "walk-left",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "walk-left_",
                end: 2,
            }),
            frameRate: 4,
            repeat: 0,
        });
        this.scene.anims.create({
            key: "walk-right",
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: "walk-right_",
                end: 2,
            }),
            frameRate: 4,
            repeat: 0,
        });

        this.character = this.scene.add.sprite(x, y, key).setScale(1);
        this.character.play("idle-left");

        this.add(this.character);
        this.scene.add.existing(this);
    }

    private movement?: {
        direction: TDirection,
        from: { x: number, y: number }
        to: { x: number, y: number }
    };
    private movingFrame = { total: 60, count: 0 };

    // moving
    public moveDirection(direction: TDirection, distance: number): void {
        if (!this.movement) {
            let x = this.character.x, y = this.character.y;

            if (direction === 'left') { x -= distance }
            else if (direction === 'right') { x += distance }
            else if (direction === 'top') { y -= distance }
            else if (direction === 'down') { y += distance }

            this.character.play(`walk-${direction}`);

            this.movement = {
                direction,
                from: { x: this.character.x, y: this.character.y },
                to: { x, y }
            }
            console.log(this.movement)
        }
    }
    public updatePosition() {

        if (this.movement) {
            // Start count the frames
            this.movingFrame.count += 1;

            const { direction, from, to } = this.movement;
            const { total, count } = this.movingFrame;

            this.character.setPosition(
                from.x + ((to.x - from.x) * count/total),
                from.y + ((to.y - from.y) * count/total),
            );

            if (total == count) {
                this.character.setPosition(to.x, to.y);
                this.character.play(`idle-${direction}`);

                // reset
                this.movement = undefined;
                this.movingFrame.count = 0;
            }
        }
        
    }
}

