import Phaser from "phaser";

type TDirection = "none" | "left" | "right" | "top" | "down";

type TAnimsConfig = {
    prefix: string,
    qty: number,
    freq?: number,
    duration?: number,
    repeat: number,
    repeatDelay?: number,
}


// TODO: intergate with battle character.
const animsConfigs: { [key: string]: TAnimsConfig[] } = {
    'tamagotchi_character_afk': [
        { prefix: 'born',        qty: 7, freq: 8, repeat: 0 },
        { prefix: 'drink',       qty: 7, freq: 4, repeat: 0 },
        { prefix: 'egg',         qty: 2, freq: 1, repeat: -1 },
        { prefix: 'walk-left',   qty: 6, freq: 8, repeat: 4 },
        { prefix: 'walk-right',  qty: 6, freq: 8, repeat: 4 },
        { prefix: 'write',       qty: 13,freq: 8, repeat: 0 },
        { prefix: 'lay-down',    qty: 4, freq: 8, repeat: 0 },
        { prefix: 'sleep',       qty: 5, freq: 2, repeat: -1 },
        { prefix: 'idle-left',   qty: 5, freq: 2, repeat: -1 },
        { prefix: 'idle-right',  qty: 5, freq: 2, repeat: -1 },
        { prefix: 'sp-1-left',   qty: 6, freq: 8, repeat: 0 },
        { prefix: 'sp-1-right',  qty: 6, freq: 8, repeat: 0 },
    ],
    'battle_beibei': [
        { prefix: 'idle',      qty: 9, freq: 8, repeat: -1, repeatDelay: 1000 },
        // { prefix: 'self-idle', qty: 5, freq: 8, repeat: 0, },
        { prefix: 'sp',        qty: 5, freq: 8, repeat: 0, },
    ],
    'battle_afk': [
        // { prefix: 'idle',      qty: 1, freq: 8, repeat: -1, repeatDelay: 1000 },
        { prefix: 'self-idle', qty: 1, freq: 8, repeat: 0, },
        // { prefix: 'sp',        qty: 1, freq: 8, repeat: 0, },
    ],
    // 'default': [
    //     { key: 'idle-left',  qty: 2, freq: 2, repeat: -1 },
    //     { key: 'idle-right', qty: 2, freq: 2, repeat: -1 },
    //     { key: 'walk-left',  qty: 2, freq: 12, repeat: -1 },
    //     { key: 'walk-right', qty: 2, freq: 12, repeat: -1 },
    //     { key: 'sleep',      qty: 2, freq: 2,  repeat: 4 },
    // ],
    // 'default-battle': [
    //     { key: 'normal',  qty: 2, freq: 2, repeat: -1 },
    //     { key: 'attack', qty: 2, freq: 2, repeat: 0 },
    //     { key: 'damage',  qty: 2, freq: 2, repeat: 0 },
    //     { key: 'win',  qty: 2, freq: 2, repeat: -1 },
    //     { key: 'dead',  qty: 2, freq: 2, repeat: -1 },
    // ],
    // 'battle-character-1': [
    //     { key: 'normal',  qty: 2, freq: 2, repeat: -1 },
    //     { key: 'attack', qty: 2, freq: 2, repeat: 0 },
    //     { key: 'damage',  qty: 2, freq: 12, repeat: 0 },
    // ]
}

export type CharacterProps = {
    x?: number,
    y?: number,
}

export class Character extends Phaser.GameObjects.Container {
    public character: Phaser.GameObjects.Sprite;

    private characterKey: string;
    
    constructor(
        scene: Phaser.Scene,
        key: string,
        props: CharacterProps,
    ) {
        super(scene);

        const { x, y, animations } = props;

        // load animation by key
        // const currentConfig = animsConfigs[key];
        this.characterKey = key;

        if (animations) {
            animations.forEach(_ani => {
                const animationName = `${key}_${_ani.prefix}`;
                const data: Phaser.Types.Animations.Animation = {
                    key: animationName,
                    frames: scene.anims.generateFrameNames(key, { prefix: `${_ani.prefix}_`, start: 1, end: _ani.qty }),
                    repeat: _ani.repeat,
                };
    
                if (typeof _ani.freq !== 'undefined')        data.frameRate = _ani.freq;
                if (typeof _ani.duration !== 'undefined')    data.duration = _ani.duration;
                if (typeof _ani.repeatDelay !== 'undefined') data.duration = _ani.repeatDelay;
                
                scene.anims.create(data);
            });
        }

        

        // create character
        const posX = x || 0;
        const posY = y || 0;
        const character = scene.add.sprite(posX, posY, key).setScale(1);

        this.add(character);
        this.character = character;
        scene.add.existing(this);
    }

    public playStatic(frame: string) {
        this.character.setTexture(this.characterKey, frame);
    }

    public async playAnimation(key: string, time?: number): Promise<void> {
        return new Promise(resolve => {
            const animationName = `${this.characterKey}_${key}`;
            this.character.play(animationName);

            this.character.on('animationcomplete', (e: Phaser.Animations.Animation) => {
                if (e.key === animationName) {
                    if (typeof time !== 'undefined') {
                        setTimeout(() => resolve(), time);
                    }
                    else {
                        resolve();
                    }
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

