import Phaser from 'phaser';



type TDirection = 'left' | 'right' | 'top' | 'down';

export class Character extends Phaser.GameObjects.Container {
    handleUpdate: (time: number) => void;
    handleDirect: (direction: TDirection) => void;
    direction: TDirection;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
        direction?: TDirection,
    )
    {
        super(scene);

        this.scene = scene;
        this.x = x;
        this.y = y;

        // idle
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames(key, {
                prefix: 'idle-',
                end: 2,
            }),
            frameRate: 4,
            repeat: -1,
        });

        const character = this.scene.add.sprite(150, 150, key).setScale(1);
        character.play('idle');

        this.add(character);
        
        
        this.direction = direction || 'down';

        this.handleUpdate = (time) => {
            console.log(time);
            // if (time >= this.moveTime) {
            //     return this.move(time);
            // }
        };

        this.handleDirect = (direction) => {
            this.direction = direction;
        }

        // faceLeft: function ()
        // {
        //     if (this.direction === UP || this.direction === DOWN)
        //     {
        //         this.heading = LEFT;
        //     }
        // },

        // faceRight: function ()
        // {
        //     if (this.direction === UP || this.direction === DOWN)
        //     {
        //         this.heading = RIGHT;
        //     }
        // },

        // faceUp: function ()
        // {
        //     if (this.direction === LEFT || this.direction === RIGHT)
        //     {
        //         this.heading = UP;
        //     }
        // },

        // faceDown: function ()
        // {
        //     if (this.direction === LEFT || this.direction === RIGHT)
        //     {
        //         this.heading = DOWN;
        //     }
        // },

        // this.move = (time) => {
        //     switch (this.direction)
        //     {
        //         case 'left':
        //             this.x = Phaser.Math.Wrap(this.x - 1, 0, 40);
        //             break;

        //         case 'right':
        //             this.x = Phaser.Math.Wrap(this.x + 1, 0, 40);
        //             break;

        //         case 'top':
        //             this.y = Phaser.Math.Wrap(this.y - 1, 0, 30);
        //             break;

        //         case 'down':
        //             this.y = Phaser.Math.Wrap(this.y + 1, 0, 30);
        //             break;
        //     }

        // }

        this.scene.add.existing(this);
    }
}
