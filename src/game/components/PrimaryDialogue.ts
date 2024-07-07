import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { canvas } from '../constants';
import { runTween } from '../utils/runTween';

type TDialogData = {
    icon: string,
    text: string
}

const defaultAlign: {text: 'left' | 'center' | 'right' } = {
    text: 'left',
}

const typingMode = 'page';

const defaultSpeechSpeed = 100;

const defaultHeight = 40;
const defaultSpacing = 12;

const textBoxWidth = 120;
const textBoxHeight = defaultHeight;
const textBoxFontSize = 10;
const textBoxFontFamily = '俐方體11號';
const textBoxSpacing = 4;

const defaultIconWidth = 32;
const defaultIconHeight = 32;
const defaultIconSpacing = 4;

//
const defaultX = canvas.width/2;
const defaultY = canvas.height - defaultHeight + (defaultHeight / 2);
const defaultWidth = canvas.width;

const defaultSpacingConfig = {
    left: textBoxSpacing,
    right: textBoxSpacing,
    top: textBoxSpacing,
    bottom: textBoxSpacing,
    icon: defaultIconSpacing,
}


export class PrimaryDialogue extends Phaser.GameObjects.Container {
    private _textBox: RexUIPlugin.TextBox;

    constructor(
        scene: Phaser.Scene
    )
    {
        // 1. Inherite from scene
        super(scene);
        this.scene = scene;
        
        // 2. Create others visual game objects
        const background = scene.make.nineslice({
            key: 'frame',
            frame: 'example',
            leftWidth: 16,
            rightWidth: 16,
            topHeight: 16,
            bottomHeight: 16,
        });

        const icon = scene.make.sprite({key: 'default_character_icons', frame: 'happy_1'});
        // const icon = this.scene.make.image({ key: 'star' });
        icon.displayWidth = defaultIconWidth;
        icon.displayHeight = defaultIconHeight;

        // 3. Create textBox
        const innerDialogue = scene.rexUI.add.BBCodeText(0, 0, '', {
            fixedWidth: textBoxWidth - (textBoxSpacing * 2),
            fixedHeight: textBoxHeight - (textBoxSpacing * 2),
            color: '#000',
            fontSize: `${textBoxFontSize}px`,
            fontFamily: textBoxFontFamily,
            lineSpacing: 2,
            padding: {
                top: textBoxSpacing,
                bottom: textBoxSpacing,
            },
            resolution: 2,
            wrap: {
                mode: 'word',
                width: textBoxWidth - (textBoxSpacing * 2)
            },
            maxLines: 2
        });
        
        const textBox = scene.rexUI.add.textBox({
            x: defaultX,
            y: defaultY,
            width: defaultWidth,
            height: defaultHeight,
            typingMode: typingMode,
            icon,
            background,
            text: innerDialogue,
            expandTextWidth: false,
            expandTextHeight: false,
            space: defaultSpacingConfig,
            align: defaultAlign
        })
        .setOrigin(0.5)
        .layout();
    
        // defined text box interaction
        textBox.setInteractive();
            
        // 4. Add all board element to scene.
        this.add(textBox); // container
        this._textBox = textBox; // dialog
        this._textBox.setScale(0);
        scene.add.existing(this); // board
        
    }
    private _runTextBox(data: TDialogData): Promise<void> {
        const { icon, text } = data;
        return new Promise((resolve) => {
            this._textBox.on('pointerdown', () => {
                if (this._textBox.isTyping) {
                    this._textBox.stop(true);
                }
                else {
                    if (this._textBox.isLastPage) {
                        this._textBox.off('pointerdown');
                        this._textBox.off('pageend');
                        resolve();
                    }
                    else {
                        this._textBox.typeNextPage();
                    }
                }
            }, this._textBox)
            .on('pageend', () => {
                if (this._textBox.isLastPage) {
                    this._textBox.off('pointerdown');
                    this._textBox.off('pageend');
                    setTimeout(() => resolve(), 1000);
                    // resolve();
                }
                else {
                    this._textBox.typeNextPage();
                }
            });
            this._textBox.start(text, defaultSpeechSpeed);
            if (icon) { this._textBox.setIconTexture(icon) }
        })
    }
    
    private _startDialogs(data: TDialogData[]): Promise<void> {
        return new Promise(resolve => {
            (async () => {
                for (let i = 0; i < data.length; i++) {
                    await this._runTextBox(data[i]);
                }
                resolve();
            })();
        })
    }

    public async runDialog(contents: TDialogData[]) {
        // 1. show dialogue container
        this.setVisible(true);
        
        // 2. run transition for opening dialog
        await runTween<RexUIPlugin.TextBox>(this._textBox, { scale: 1 }, 100);
        
        // 3. start dialogs
        await this._startDialogs(contents);
        
        // 4. run transition for closing dialog
        await runTween<RexUIPlugin.TextBox>(this._textBox, { scale: 0 }, 100);

        // 5. hide dialugue container
        this.setVisible(false);

        return;
    }
    
}

