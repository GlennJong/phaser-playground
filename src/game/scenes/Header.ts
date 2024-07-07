import Phaser from 'phaser';
import { canvas } from '../constants';
import { Button } from '../components/Button';

const defaultWidth = canvas.width;
const defaultHeight = 30;


const buttons = [
    { key: 'star', text: 'shop', scene: 'shop' },
    { key: 'star', text: 'room', scene: 'room' },
    { key: 'star', text: 'test' },
]


export class Header extends Phaser.GameObjects.Container {
    // private _textBox: RexUIPlugin.TextBox;

    constructor(
        scene: Phaser.Scene
    )
    {
        // 1. Inherite from scene
        super(scene);
        
        // 2. background
        const background = scene.make.nineslice({
            key: 'frame',
            frame: 'example',
            width: defaultWidth,
            x: defaultWidth/2,
            y: defaultHeight/2,
            height: defaultHeight,
            leftWidth: 16,
            rightWidth: 16,
            topHeight: 16,
            bottomHeight: 16,
        }).setOrigin(0.5);


        // 3. defined button
        const battleButton = scene.make.sprite({
            key: 'header-icons',
            frame: 'battle',
            x: 24,
            y: 14,
        });

        const roomButton = scene.make.sprite({
            key: 'header-icons',
            frame: 'room',
            x: 54,
            y: 15,
        });

        // 4. Arrow
        const selector = scene.make.sprite({
            key: 'header-icons',
            frame: 'arrow',
            x: 12,
            y: 14,
        });

        scene.tweens.add({
            targets: selector,
            repeat: -1,
            yoyo: true,
            ease: 'linear',
            duration: 500,
            alpha: 0,
            pause: true,
        });


        this.add(background);

        this.add(selector);
        this.add(battleButton);
        this.add(roomButton);

        scene.add.existing(this); // board
        
    }
    
}

