import Phaser, { GameObjects } from 'phaser';

// const Character
export default class Character
{
    constructor ()
    {
    }

}

// export default class Character extends GameObjects
// {
//     camera: Phaser.Cameras.Scene2D.Camera;
//     background: Phaser.GameObjects.Image;
//     gameText: Phaser.GameObjects.Text;

//     constructor ()
//     {
//         super('Character');
//     }
//     preload()
//     {
//         // this.load.setPath('assets');

//         // character.load();
        
//         this.load.spritesheet('mummy', 'mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
//         // this.load.image('background-room', 'background-room.png');
//     }

//     create ()
//     {
//         this.camera = this.cameras.main;
//         this.camera.setBackgroundColor(0xFF0000);


//         // this.background = this.add.image(canvas.width, canvas.height, 'background-room');
//         this.background = this.add.image(canvas.width/2, canvas.height/2, 'background-room');
//         this.background.setScale(1.5);

//         // defined animation
//         this.anims.create({
//             key: 'walk',
//             frames: this.anims.generateFrameNumbers('mummy'),
//             frameRate: 12,
//             repeat: -1
//         });
//         const sprite1 = this.add.sprite(50, 100, 'mummy').setScale(1);

//         // animation
//         sprite1.play({ key: 'walk', randomFrame: true, delay: 2000, showBeforeDelay: true });

//         // movement
//         this.tweens.add({
//             targets: [ sprite1 ],
//             x: 750,
//             flipX: true,
//             yoyo: true,
//             repeat: -1,
//             duration: 8000,
//             delay: 2000
//         });

//         this.scene.launch('UI');

//         this.gameText = this.add.text(200, 200, 'This is Room', {
//             fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
//             stroke: '#000000', strokeThickness: 8,
//             align: 'center'
//         }).setOrigin(0.5).setDepth(100);

//         EventBus.emit('current-scene-ready', this);
//     }
// }
