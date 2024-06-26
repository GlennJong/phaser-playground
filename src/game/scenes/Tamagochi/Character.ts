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
        
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('mummy'),
            frameRate: 12,
            repeat: -1
        });

        const button = this.scene.add.image(x, y, `star_up`).setInteractive();

        // const character = this.scene.add.sprite(x, y, key).setScale(1);
        // console.log({character});
        // character.play({ key: 'walk', randomFrame: true, delay: 2000, showBeforeDelay: true });
        // character.play('walk');
        this.add(button);
        
        
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
