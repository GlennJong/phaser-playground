import { useEffect, useMemo, useRef, useState } from 'react';
import { connectChatWebhook, disconnectChatWebhook, getBasic, TBasic } from './provider/Basic';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { openTwitchOauthLogin } from './connection/twitchOauthLogin';
import { getUserDataById } from './connection/twitchGetUserData';
import { Game } from './game/scenes/Game';

function App2()
{
    const [ userData, setUserData ] = useState<TBasic>()

    const [ app, setApp ] = useState({});

    // const isConnectedRef = useRef(false);

    const [ temp, setTemp ] = useState([
        {user: 'example', message: 'test'},
        {user: 'example2', message: 'test2'},
    ]);
    
    useEffect(() => {
        // handleGetBasic();
        // handleClickConnectWebsocket();
    }, [])

    const handleGetBasic = async() => {
        const data = await getBasic();
        if (data) {
            setUserData(data);
        }
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
    
    const websocketRef = useRef();
    
    const handleClickConnectWebsocket = async () => {
        let ws = new WebSocket('/socket');

        ws.onopen = () => {
            console.log('open connection')
        }
        ws.onclose = () => {
            console.log('close connection')
        }

        ws.addEventListener("message", async (event) => {
            const data = JSON.parse(event.data);

            const message = data.event.message.text;
            const user = data.event.chatter_user_name;
            const scene = phaserRef.current.scene as Game;

            if (message.includes('up')) {
                scene.controller('up');
                temp.push({ user, message });
                setTemp([...temp]);
            }
            else if (message.includes('left')) {
                scene.controller('left');
                temp.push({ user, message });
                setTemp([...temp]);
            }
            else if (message.includes('right')) {
                scene.controller('right');
                temp.push({ user, message });
                setTemp([...temp]);
            }
            else if (message.includes('down')) {
                scene.controller('down');
                temp.push({ user, message });
                setTemp([...temp]);
            }
            else if (message.includes('sleep')) {
                scene.controller('sleep');
                temp.push({ user, message });
                setTemp([...temp]);
            }
            else if (message.includes('say:')) {
                scene.customDialog(message.replace('say:', ''));
                temp.push({ user, message });
                setTemp([...temp]);
            }
            
            // console.log(data);
        });
        // const res = await getData('http://localhost:8001', {
        // })
        // console.log(res)

        websocketRef.current = ws;
    }
    

    // const handleConnectChatWebhook = async() => {
    //     const result = await connectChatWebhook();
    //     console.log('connected', result);
        
    // }
    // const handleDisconnectChatWebhook = async () => {
    //     const result = await disconnectChatWebhook();
    //     console.log('disconnected', result);
    // }
    
    // const handleSend = () => {
    //   websocketRef.current.send('messsss');
    // }

    const handleClickOauthLoginButton = () => {
        if (app.client_id) {
            openTwitchOauthLogin('', 'https://localhost:8001/redirect');
        }
    }

    const phaserRef = useRef<IRefPhaserGame | null>(null);



    const handleClickTestButton = () => {
        setTemp([...temp, { user: 'test', message: '123' }])
        // console.log(phaserRef.current)
        // const scene = phaserRef.current.scene as Game;
        // scene.controller('left');
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
                <PhaserGame ref={phaserRef} currentActiveScene={undefined} />
                <div style={{ width: '500px', whiteSpace: 'break-spaces' }}>
                    {
                        [...temp].reverse().slice(0, 5).map((_item, i) =>
                            <div key={i}>{ _item.user }: { _item.message }</div>
                        )
                    }
                </div>
                {/* <a href="https://prod.liveshare.vsengsaas.visualstudio.com/join?FF8C8372984BD78B3E0093CB4F0AD3251FA8">link</a> */}
                <br />
                <button onClick={handleClickOauthLoginButton}>login</button>
                <button onClick={handleClickTestButton}>test</button>
                {/* <button onClick={handleConnectChatWebhook}>Connect Chat webhook</button> */}
                {/* <button onClick={handleDisconnectChatWebhook}>Disconnect Chat webhook</button> */}
                {/* <button onClick={handleClickConnectWebsocket}>connect websocket</button> */}
            </div>

        </div>
    )
}

export default App2
