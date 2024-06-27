import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { Character } from './Character';
import { Button } from './UI';



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
        this.load.image('star', 'star.png');
        this.load.atlas('person', 'spritesheets/person/spritesheet.png', 'spritesheets/person/spritesheet.json');

        this.load.image('star', 'star.png');
        this.load.spritesheet('mummy', 'mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
        this.load.image('background-room', 'background-room.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);

        this.background = this.add.image(canvas.width/2, canvas.height/2, 'background-room');
        this.background.setScale(1.5);

        // this.anims.create({
        //     key: 'idle',
        //     frames: this.anims.generateFrameNames('person', {
        //         prefix: 'idle-',
        //         end: 2,
        //     }),
        //     frameRate: 4,
        //     repeat: -1,
        // });
        // const character = this.add.sprite(150, 150, 'person').setScale(1);
        // character.play('idle');

        
        const Andy = new Character(this, 120, 220, 'person');
        Andy.handleDirect('left');
        // console.log(newCharacter);
        
        // this.background = this.add.image(canvas.width, canvas.height, 'background-room');
        // const shopButton = new Button(this, 30, 80, 'star', 'shop');
        // const button = this.add.image(30, 200, `star`).setInteractive();



        // defined animation
        // this.anims.create({
        //     key: 'walk',
        //     frames: this.anims.generateFrameNumbers('mummy'),
        //     frameRate: 12,
        //     repeat: -1
        // });
        // const character = this.add.sprite(50, 100, 'mummy').setScale(1);
        

        // animation
        // character.play({ key: 'walk', randomFrame: true, delay: 2000, showBeforeDelay: true });
        // character.play('walk');

        // this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        //     this.anims.remove('run')
        // })
        

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

        this.gameText = this.add.text(400, 200, 'This is Room', {
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
