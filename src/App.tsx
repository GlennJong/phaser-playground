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

    const addSprite = () => {

        if (phaserRef.current)
        {
            const scene = phaserRef.current.scene;

            if (scene)
            {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);
    
                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, 'star');
    
                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1
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
                {/* <p style={{ background: `hsla(0, 0%, 0%, .75)`, padding: '12px'  }}>
                    看能不能在 12:00 前把戰鬥角色寫完<br/>
                    - 角色移動限制器<br/>
                    - 解析度調節器<br/>
                    - 串接 Twitch API<br/>
                </p> */}
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </div>
            <div>
                {/* <div>
                    <p style={{ color: '#fff',
                        fontFamily: '俐方體11號',
                        fontSize: '11px' }}>壹貳參</p>
                    
                    
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div> */}
                {/* <div>
                    <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                </div> */}
                {/* <div className="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                </div> */}
                {/* <div>
                    <button className="button" onClick={addSprite}>Add New Sprite</button>
                </div> */}
            </div>
        </div>
    )
}

export default App
