import { useEffect, useRef, useState } from 'react';
import { connectChatWebhook, disconnectChatWebhook, getBasic, TBasic } from './provider/Basic';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { openTwitchOauthLogin } from './connection/twitchOauthLogin';
import { getUserDataById } from './connection/twitchGetUserData';

function App2()
{
    const [ userData, setUserData ] = useState<TBasic>()

    const [ app, setApp ] = useState({});

    // const isConnectedRef = useRef(false);

    const [ temp, setTemp ] = useState([
        { user: 'tmp', message: '123' }
    ]);
    
    useEffect(() => {
        handleGetBasic();
    }, [])

    const handleGetBasic = async() => {
        const data = await getBasic();
        // if (data) {
        //     setUserData(data);
        // }
    }

    
    // The sprite can only be moved in the MainMenu Scene
    const websocketRef = useRef();

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
    
    const handleClickConnectWebsocket = async () => {
        let ws = new WebSocket('ws://localhost:8001');

        let isConnected = false;

        ws.onopen = () => {
            console.log('open connection')
        }
        ws.onclose = () => {
            console.log('close connection')
        }

        ws.addEventListener("message", async (event) => {
            const data = JSON.parse(event.data);
            console.log(data);

            
        });
        // const res = await getData('http://localhost:8001', {
        // })
        // console.log(res)

        websocketRef.current = ws;
    }

    const handleConnectChatWebhook = async() => {
        const result = await connectChatWebhook();
        console.log('connected', result);
        
    }
    const handleDisconnectChatWebhook = async () => {
        const result = await disconnectChatWebhook();
        console.log('disconnected', result);
    }
    
    const handleSend = () => {
      websocketRef.current.send('messsss');
    }

    const handleClickOauthLoginButton = () => {
        if (app.client_id) {
            openTwitchOauthLogin('', 'https://localhost:8001/redirect');
        }
    }

    const phaserRef = useRef<IRefPhaserGame | null>(null);




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
                <PhaserGame ref={phaserRef} currentActiveScene={undefined} />
                {
                    userData ? 'allow connection' : 'connect yet'
                }
                {
                    temp.map((_item, i) =>
                        <div key={i}>{ _item.user }: { _item.message }</div>
                    )
                }
                <br />
                <button onClick={handleClickOauthLoginButton}>login</button>
                {/* <button onClick={handleConnectChatWebhook}>Connect Chat webhook</button> */}
                {/* <button onClick={handleDisconnectChatWebhook}>Disconnect Chat webhook</button> */}
                <button onClick={handleClickConnectWebsocket}>connect websocket</button>
                <button onClick={handleSend}>Send</button>
            </div>

        </div>
    )
}

export default App2
