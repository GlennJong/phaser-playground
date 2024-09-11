import { EventBus } from '../../EventBus';
import Phaser, { Scene } from 'phaser';
import { canvas } from '../../constants';
import { PrimaryDialogue } from '../../components/PrimaryDialogue';
import { Header } from './Header';
import { TamagotchiCharacter } from './TamagotchiCharacter';
import { RoomWindow } from './RoomWindow';
import { RoomRecorder } from './RoomRecorder';


// TODO: hotfix for RexDialogue component
const maxChineseAmount = 8;

// contribute by ai4upwjp
function converterFromai4upwjp(input: string) {
    const result = [];
    let buffer = '';
    let chineseCount = 0;
    
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        if (char.match(/[a-zA-Z\d]/)) {
            if (chineseCount > 0) {
                result.push(buffer);
                buffer = '';
                chineseCount = 0;
            }
            buffer += char;
        } else if (char.match(/[\u4e00-\uff1f]/)) {
            if (buffer.length > 0 && chineseCount === 0) {
                result.push(buffer);
                buffer = '';
            }
            buffer += char;
            chineseCount++;
            if (chineseCount === maxChineseAmount) {
                result.push(buffer);
                buffer = '';
                chineseCount = 0;
            }
        } else {
            if (buffer.length > 0) {
                result.push(buffer);
                buffer = '';
                chineseCount = 0;
            }
        }
    }
    
    if (buffer.length > 0) {
        result.push(buffer);
    }
    
    return result.join(' ');
    
}

const drinkDialogContent = [
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-normal'
        },
        text: converterFromai4upwjp('感謝 ai4upwjp 兌換喝水，為 AFK 君和安迪補充了 10 點水分！')
    },
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-angry'
        },
        text: converterFromai4upwjp('夏天要記得注意補充水分！要是中暑可是很危險的喔！')
    },
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-sad'
        },
        text: converterFromai4upwjp('拜託一定要喝水喔！')
    },
];

const writeDialogContent = [
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-normal'
        },
        text: converterFromai4upwjp('感謝 curry_cat 兌換存擋，為 AFK 君和安迪補充了 10 點生命，大家記得幫手邊工作存個檔！')
    },
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-angry'
        },
        text: converterFromai4upwjp('要是突然停電可是很危險的喔！')
    },
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-sad'
        },
        text: converterFromai4upwjp('拜託一定要存檔喔！')
    },
];

const sleepDialogContent = [
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-sad'
        },
        text: converterFromai4upwjp('我累了，讓我睡一下，16:30 回來...')
    },
    {
        icon: {
            key: 'tamagotchi_character_afk',
            frame: 'face-sad'
        },
        text: converterFromai4upwjp('大家起來多動一動喔！')
    },
];

export default class Room extends Scene
{
    character: Phaser.GameObjects.Sprite;
    camera: Phaser.Cameras.Scene2D.Camera;
    
    keyLeft: typeof Phaser.Input.Keyboard.KeyCodes | null;
    keyRight: typeof Phaser.Input.Keyboard | null;
    keyTop: typeof Phaser.Input.Keyboard | null;
    keyDown: typeof Phaser.Input.Keyboard | null;


    header: Header;
    keyboardInputer: typeof Phaser.Input.Keyboard;

    private tamagotchi: TamagotchiCharacter;
    // private heartBar: HeartBar;

    constructor ()
    {
        super('Room');
    }
    preload()
    {

    }
    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xFF0000);
        
        this.handleRenderScene(this);

        EventBus.emit('current-scene-ready', this);
    }

    private dialogue: PrimaryDialogue;
    // private dialogueCharactor: string;

    private handleRenderScene(scene: Phaser.Scene) {
        const background = scene.add.image(canvas.width/2, canvas.height/2, 'tamagotchi_room');
        background.displayWidth = canvas.width;
        background.displayHeight = canvas.height;


        // Dialogue
        const dialogue = new PrimaryDialogue(scene);
        this.dialogue = dialogue;

        // Window
        new RoomWindow(scene, { x: 80, y: 32 });

        // Recorder
        new RoomRecorder(scene, { x: 26, y: 62 })


        scene.make.sprite({ key: 'tamagotchi_room_desk', x: 134, y: 48 });

        // Header Block
        this.header = new Header(scene);
        // this.header.setAlpha(0); // TODO: auto hide
        
        // Build Tamagotchi Charactor
        this.tamagotchi = new TamagotchiCharacter(
            scene,
            { x: 80, y: 84, key: 'tamagotchi_character_afk', hp: 10 }, // status
            { from: 50, to: 120 }, // position limitation
            { onHpChange: (value: number) => this.header.setValue({hp: value}) } // TODO: add action callback
        );

        // apply hp
        this.header.setValue({ hp: this.tamagotchi.status.hp });

        this.dialogue.runDialog(sleepDialogContent);

        this.keyboardInputer = scene.input.keyboard?.createCursorKeys();
    }
    
    
    controller(input: string) {
        const movementInput = ['left', 'right'];
        if (movementInput.includes(input)) {
            this.tamagotchi.manualContolDirection(input);
        }
        else {
            this.tamagotchi.manualContolAction(input);
        }
    }

    customDialog(input: string) {
        // this.board.runDialog([{ icon: 'happy_1', text: input}]);
    }

    private keyboardflipFlop = { left: false, right: false, space: false };

    private handleHeaderAction(action) {
        // console.log(action)
        if (action === 'drink') {
            this.tamagotchi.runFuntionalAction('drink');
            this.dialogue.runDialog(drinkDialogContent);
        } else if (action === 'battle') {
            // 
        } else if (action === 'write') {
            this.tamagotchi.runFuntionalAction('write');
            this.dialogue.runDialog(writeDialogContent);
        } else if (action === 'sleep') {
            this.tamagotchi.runFuntionalAction('sleep');
            this.dialogue.runDialog(sleepDialogContent);
        }

    }
    
    update(time: number) {
        
        // movement controller
        this.tamagotchi.characterHandler(time);
        this.header.statusHandler(time);

        // temp Controller
        if (this.keyboardInputer) {
            if (this.keyboardInputer['left'].isDown) {
                if (this.keyboardflipFlop.left) return;
                this.header.moveToPreviousSelector();
                this.keyboardflipFlop.left = true;
            }
            else if (this.keyboardflipFlop.left && this.keyboardInputer['left'].isUp) {
                this.keyboardflipFlop.left = false;
            }

            if (this.keyboardInputer['right'].isDown) {
                if (this.keyboardflipFlop.right) return;
                this.header.moveToNextSelector();
                this.keyboardflipFlop.right = true;
            }
            else if (this.keyboardflipFlop.right && this.keyboardInputer['right'].isUp) {
                this.keyboardflipFlop.right = false;
            }

            if (this.keyboardInputer['space'].isDown) {
                if (this.keyboardflipFlop.space) return;
                // const currentSelector = this.header.currentSelector;
                // this.header.currentSelector;
                this.handleHeaderAction(this.header.currentSelector);
                this.keyboardflipFlop.space = true;
            }
            else if (this.keyboardflipFlop.space && this.keyboardInputer['space'].isUp) {
                this.keyboardflipFlop.space = false;
            }
        }
        
    }

}
