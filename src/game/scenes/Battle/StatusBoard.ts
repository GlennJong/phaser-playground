import Phaser from 'phaser';
import { canvas } from '../../constants';
import { Button } from '../components/Button';

const defaultWidth = 100;
const defaultHeight = 36;

const hpFrameWidth = 80;
const hpFrameHeight = 6;

const hpBarWidth = 80;
const hpBarHeight = 2;


const buttons = [
    { key: 'star', text: 'shop', scene: 'shop' },
    { key: 'star', text: 'room', scene: 'room' },
    { key: 'star', text: 'test' },
]


export class StatusBoard extends Phaser.GameObjects.Container {
    // private _textBox: RexUIPlugin.TextBox;
    private isMoving: boolean = false;
    private hpBar: Phaser.GameObjects.NineSlice;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        name: string,
    )
    {
        // 1. Inherite from scene
        super(scene);
        
        // 2. background
        const background = scene.make.nineslice({
            key: 'frame',
            frame: 'example',
            width: defaultWidth,
            height: defaultHeight,
            leftWidth: 16,
            rightWidth: 16,
            topHeight: 16,
            bottomHeight: 16,
        })
        .setOrigin(0.5)
        .setPosition(x, y);

        // 3. name
        const boardName = scene.make.text({
          x: x - 40,
          y: y - 14,
          style: { fontFamily: '俐方體11號', fontSize: 8, color: '#000' },
          text: name,
        });

        // 4. hp bar
        const hpFrame = scene.make.nineslice({
            key: 'status-board-hp',
            frame: 'frame',
            width: hpFrameWidth,
            height: hpFrameHeight,
            leftWidth: 3,
            rightWidth: 3,
            topHeight: 3,
            bottomHeight: 3,
        })
        .setOrigin(0)
        .setPosition(x - 40, y - 4);


        this.fullHp = 100;
        this.hp = 100;
        
        const hpBar = scene.make.nineslice({
            key: 'status-board-hp',
            frame: 'bar',
            width: hpFrameWidth,
            height: 6,
            leftWidth: 3,
            rightWidth: 3,
            topHeight: 3,
            bottomHeight: 3,
        })
        .setOrigin(0)
        .setPosition(x - 40, y - 4);

        hpBar.width = (this.hp / this.fullHp) * hpFrameWidth;
        this.hpBar = hpBar;

        this.add(background);
        this.add(boardName);
        this.add(hpFrame);
        this.add(hpBar);

        // 5. hp number
        const currentHP = scene.make.text({
            x: x - 40,
            y: y + 2,
            style: { fontFamily: '俐方體11號', fontSize: 9, color: '#000' },
            text: this.hp,
        });

        const slash = scene.make.text({
            x: x,
            y: y + 2,
            style: { fontFamily: '俐方體11號', fontSize: 9, color: '#000' },
            text: '/',
        });

        const allHP = scene.make.text({
            x: x + 40,
            y: y + 2,
            style: { fontFamily: '俐方體11號', fontSize: 9, color: '#000' },
            text: '100',
        }).setOrigin(1, 0);

        this.currentHp = currentHP;
        
        this.add(currentHP);
        this.add(slash);
        this.add(allHP);

        scene.add.existing(this); // board
    }
    
    private currentHpAction?: {
        from: { hp: number },
        to: { hp: number },
        callback: () => void
    };
    private currentUpdateFrame = { total: 60, count: 0 };
    
    private handleDecreaseHP(value: number, callbackFunc: () => void) {
        if (!this.currentHpAction) {

            const resultHp = this.hp - value;
            this.currentHpAction = {
                from: { hp: this.hp, },
                to: { hp: resultHp },
                callback: callbackFunc
            }
        }
    }

    public decreaseHP(value: number): Promise<void> {
        return new Promise(resolve => {
            this.handleDecreaseHP(value, () => {
                resolve();
            })
        })
    }
    
    public updateStatusBoard() {

        if (this.currentHpAction) {
            // Start count the frames
            this.currentUpdateFrame.count += 1;

            // movement
            const { from, to } = this.currentHpAction;
            const { total, count } = this.currentUpdateFrame;

            const point = from.hp + ((to.hp - from.hp) * count/total)
            
            this.hp = Math.floor(point);
            this.hpBar.width = (point / this.fullHp) * hpFrameWidth;
            if (this.currentHp) {
                this.currentHp.setText(this.hp);
            }

            if (total == count) {
                this.hp = to.hp;
                this.hpBar.width = (this.hp / this.fullHp) * hpFrameWidth;
                this.currentHp.setText(this.hp);
                
                // reset after moved
                this.currentHpAction.callback();
                this.currentHpAction = undefined;
                this.currentUpdateFrame.count = 0;
            }
        }

        
    }
    
}

