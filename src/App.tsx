import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';

function App()
{
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {
        
        if(phaserRef.current)
            {     
                console.log(phaserRef.current)
                const scene = phaserRef.current.scene as MainMenu;
            
            if (scene)
            {
                scene.changeScene();
            }
        }
    }


    const moveSprite = () => {

        if(phaserRef.current)
        {

            const scene = phaserRef.current.scene as MainMenu;

            if (scene && scene.scene.key === 'MainMenu')
            {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {

                    setSpritePosition({ x, y });

                });
            }
        }

    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
        
    }

    return (
        <div id="app" style={{ position: 'relative', flexDirection: 'column', background: `url('/img/background.png')`, backgroundSize: 'cover' }}>
            
            <div style={{
                position: 'absolute',
                top: '0', left: '0', bottom: '0', right: '0',
                background: '#000',
                opacity: 0.6
            }}
            ></div>
            <div style={{
                position: 'relative',
                zIndex: '1',
            }}>
                <p style={{ background: `hsla(0, 0%, 0%, .75)`, padding: '12px'  }}>
                    AFK
                    看能不能在 12:00 前把戰鬥角色寫完<br/>
                    - <del>戰鬥角色忘記做死掉的狀態了</del><br/>
                    - <del>角色移動限制器</del><br/>
                    - 字體解析度問題<br/>
                    - 解析度調節器<br/>
                    - 串接 Twitch API<br/>
                </p>
                {/* <PhaserGame ref={phaserRef} currentActiveScene={currentScene} /> */}
            </div>
            <div>
            </div>
        </div>
    )
}

export default App
