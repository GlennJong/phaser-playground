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
        this.add(background);


        // 3. defined button
        buttons.forEach((_button, i) => {
            // const button = new Button(scene, (10 * i), 10, _button.key, _button.text);
            // this.add(button);
        })
        
        scene.add.existing(this); // board
        
    }
    
}

