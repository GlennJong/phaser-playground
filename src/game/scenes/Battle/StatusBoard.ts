import Phaser from 'phaser';

const defaultWidth = 100;
const defaultHeight = 36;

const hpFrameWidth = 80;
const hpFrameHeight = 6;

export type TStatusBoardProps = {
    name: string,
    hp: number,
    max_hp: number
}

export class StatusBoard extends Phaser.GameObjects.Container {
    private hp: number;
    private maxHp: number;
    private hpBar: Phaser.GameObjects.NineSlice;
    private currentHpText: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        data: TStatusBoardProps,
    )
    {
        // step1. Inherite from scene & set hp value
        super(scene);
        this.maxHp = data.max_hp;
        this.hp = data.hp;


        // step2. init background
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
        this.add(background);


        // step3. init status board data
        const boardName = scene.make.text({
          x: x - 40,
          y: y - 14,
          style: { fontFamily: '俐方體11號', fontSize: 8, color: '#000' },
          text: data.name,
        });

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
        
        // step4. init hp bar
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

        hpBar.width = (this.hp / this.maxHp) * hpFrameWidth;
        this.add(boardName);
        this.add(hpFrame);
        this.add(hpBar);

        this.hpBar = hpBar;

        // 5. hp number
        const currentHPText = scene.make.text({
            x: x - 40,
            y: y + 2,
            style: { fontFamily: '俐方體11號', fontSize: 9, color: '#000' },
            text: this.hp.toString(),
        });
        this.add(currentHPText);
        this.currentHpText = currentHPText;

        const slash = scene.make.text({
            x: x,
            y: y + 2,
            style: { fontFamily: '俐方體11號', fontSize: 9, color: '#000' },
            text: '/',
        });
        this.add(slash);

        const allHPText = scene.make.text({
            x: x + 40,
            y: y + 2,
            style: { fontFamily: '俐方體11號', fontSize: 9, color: '#000' },
            text: '100',
        }).setOrigin(1, 0);
        this.add(allHPText);

        scene.add.existing(this);
    }
    
    // define hp action for every frame animation
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
                to: { hp: resultHp < 0 ? 0 : resultHp},
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
            this.hpBar.width = (point / this.maxHp) * hpFrameWidth;
            if (this.currentHpText) {
                this.currentHpText.setText(this.hp.toString());
            }

            if (total == count) {
                this.hp = to.hp;
                this.hpBar.width = (this.hp / this.maxHp) * hpFrameWidth;
                this.currentHpText.setText(this.hp.toString());
                
                // reset after moved
                this.currentHpAction.callback();
                this.currentHpAction = undefined;
                this.currentUpdateFrame.count = 0;
            }
        }

        
    }
    
}

