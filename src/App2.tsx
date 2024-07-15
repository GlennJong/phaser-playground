import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';

function App2()
{

  useEffect(() => {
    const token = window.location.href;
    console.log({token});
  }, []);
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    const websocketRef = useRef();
    
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

    function postData(url, data) {
        // Default options are marked with *

        return fetch(url, {
          body: data, // must match 'Content-Type' header
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, same-origin, *omit
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // *client, no-referrer
        }).then((response) => response.json()); // 輸出成 json
    }

    function getData(url, headers) {
        // Default options are marked with *

        return fetch(url, {
          headers,
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, same-origin, *omit
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // *client, no-referrer
        }).then((response) => response.json()); // 輸出成 json
    }
    
    const handleConnectToTwitch3 = async () => {
        let ws = new WebSocket('ws://localhost:8002');
        ws.onopen = () => {
            console.log('open connection')
        }
        ws.onclose = () => {
            console.log('close connection')
        }

        ws.addEventListener("message", (event) => {
          console.log("Message from server ", event.data);
        });
        // const res = await getData('http://localhost:8001', {
        // })
        // console.log(res)

        websocketRef.current = ws;
    }

    const handleSend = () => {
      websocketRef.current.send('messsss');
    }

    const handleConnectToTwitch2 = () => {
        const elem = document.createElement('a');
        const token = '';
        const client_id = ``
        const redurect_uri = 'https://localhost:8001/redirect';
        const params = `response_type=token&force_verify=true&client_id=${client_id}&redirect_uri=${redurect_uri}`
        window.open(`https://id.twitch.tv/oauth2/authorize?${params}`,"My Window Name", "width=400,height=400")
    }

    return (
        <div id="app" style={{ position: 'relative', flexDirection: 'column', background: `black` }}>
          <div style={{
                position: 'absolute',
                top: '0', left: '0', bottom: '0', right: '0',
                opacity: 0.6,
                background: `url('/img/background.png')`,
                backgroundSize: 'cover',
                zIndex: 0
            }}
            ></div>
            <div style={{ zIndex: 1, position: 'relative' }}>
              <button onClick={handleConnectToTwitch2}>login</button>
              <button onClick={handleConnectToTwitch3}>connect</button>
              <button onClick={handleSend}>Send</button>
            </div>

        </div>
    )
}

export default App2
