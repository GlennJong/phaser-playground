import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
// import { Character } from './Character';



export default class Room extends Scene
{
    character: Phaser.GameObjects.Sprite;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Room');
    }
    preload()
    {
        this.load.setPath('assets');

        // character.load();
        
        this.load.spritesheet('mummy', 'mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
        this.load.image('background-room', 'background-room.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);

        const x = new Phaser.Class();
        console.log(x);

        // this.background = this.add.image(canvas.width, canvas.height, 'background-room');
        this.background = this.add.image(canvas.width/2, canvas.height/2, 'background-room');
        this.background.setScale(1.5);

        // defined animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('mummy'),
            frameRate: 12,
            repeat: -1
        });
        this.character = this.add.sprite(50, 100, 'mummy').setScale(1);
        

        // animation
        // character.play({ key: 'walk', randomFrame: true, delay: 2000, showBeforeDelay: true });
        this.character.play('walk');

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.anims.remove('run')
        })
        

        // movement
        // this.tweens.add({
        //     targets: [ character ],
        //     x: 750,
        //     flipX: true,
        //     yoyo: true,
        //     repeat: -1,
        //     duration: 8000,
        //     delay: 2000
        // });

        this.scene.launch('UI');

        this.gameText = this.add.text(200, 200, 'This is Room', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    update(time, delta) {
        // if (cursors.left.isDown)
        // {
        //     this.charactor.faceLeft();
        // }
        // else if (cursors.right.isDown)
        // {
        //     this.charactor.faceRight();
        // }
        // else if (cursors.up.isDown)
        // {
        //     this.charactor.faceUp();
        // }
        // else if (cursors.down.isDown)
        // {
        //     this.charactor.faceDown();
        // }
    
        // if (this.charactor.update(time))
        // {
    
        //     if (snake.collideWithFood(food))
        //     {
        //         repositionFood();
        //     }
        // }
    }
}
