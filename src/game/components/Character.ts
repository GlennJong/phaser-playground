import Phaser from "phaser";

type TDirection = "none" | "left" | "right" | "top" | "down";

type TAnimsConfig = {
    key: string,
    qty: number,
    freq?: number,
    duration?: number,
    repeat: number,
}

const animsConfigs: { [key: string]: TAnimsConfig[] } = {
    default: [
        { key: 'idle-left',  qty: 2, freq: 2, repeat: -1 },
        { key: 'idle-right', qty: 2, freq: 2, repeat: -1 },
        { key: 'walk-left',  qty: 2, freq: 12, repeat: -1 },
        { key: 'walk-right', qty: 2, freq: 12, repeat: -1 },
        { key: 'sleep',      qty: 2, freq: 2,  repeat: 4 },
    ],
    'default-battle': [
        { key: 'normal',  qty: 2, freq: 2, repeat: -1 },
        { key: 'attack', qty: 2, freq: 2, repeat: 0 },
        { key: 'damage',  qty: 2, freq: 2, repeat: 0 },
    ],
    'battle-character-1': [
        { key: 'normal',  qty: 2, freq: 2, repeat: -1 },
        { key: 'attack', qty: 2, freq: 2, repeat: 0 },
        { key: 'damage',  qty: 2, freq: 12, repeat: 0 },
    ]
}

export type CharacterProps = {
    x?: number,
    y?: number,
    key: string,
}

export class Character extends Phaser.GameObjects.Container {
    public character: Phaser.GameObjects.Sprite;
    
    constructor(
        scene: Phaser.Scene,
        props: CharacterProps
    ) {
        super(scene);

        const { x, y, key } = props;

        // load animation by key
        const currentConfig = animsConfigs[key];
        
        currentConfig.forEach(_ani => {
            const data: Phaser.Types.Animations.Animation = {
                key: _ani.key,
                frames: scene.anims.generateFrameNames(key, { prefix: `${_ani.key}_`, end: _ani.qty - 1 }),
                repeat: _ani.repeat,
            };
            if (_ani.freq)     data.frameRate = _ani.freq;
            if (_ani.duration) data.duration = _ani.duration;

            scene.anims.create(data);
        })

        // create character
        const posX = x || 0;
        const posY = y || 0;
        const character = scene.add.sprite(posX, posY, key).setScale(1);

        this.add(character);
        this.character = character;
        scene.add.existing(this);
    }

    public async playAnimation(key: string): Promise<void> {
        return new Promise(resolve => {
            this.character.play(key);
            this.character.on('animationcomplete', (e: Phaser.Animations.Animation) => {
                if (e.key === key) {
                    resolve();
                    this.character.off('animationcomplete');
                }
            })
        })
    }
    
    // move action status
    private currentMoveAction?: {
        from: { x: number, y: number },
        to: { x: number, y: number },
        callback: () => void
    };
    private currentMovingFrame = { total: 60, count: 0 };

    // moving
    public moveDirection(direction: TDirection, distance: number, callbackFunc: () => void) {
        if (!this.currentMoveAction) {
            let x = this.character.x, y = this.character.y;

            if (direction === 'left') { x -= distance }
            else if (direction === 'right') { x += distance }
            else if (direction === 'top') { y -= distance }
            else if (direction === 'down') { y += distance }

            this.currentMoveAction = {
                from: { x: this.character.x, y: this.character.y },
                to: { x, y },
                callback: callbackFunc
            }
        }
    }

    public updatePosition(): void {
        if (this.currentMoveAction) {
            // Start count the frames
            this.currentMovingFrame.count += 1;

            // movement
            const { from, to } = this.currentMoveAction;
            const { total, count } = this.currentMovingFrame;

            this.character.setPosition(
                from.x + ((to.x - from.x) * count/total),
                from.y + ((to.y - from.y) * count/total),
            );

            if (total == count) {
                this.character.setPosition(to.x, to.y);

                // reset after moved
                this.currentMoveAction.callback();
                this.currentMoveAction = undefined;
                this.currentMovingFrame.count = 0;
            }
        }
        
    }
}

