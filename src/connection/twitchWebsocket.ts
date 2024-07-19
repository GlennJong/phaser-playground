const handleConnectToTwitch = async () => {
    let ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30');

    let isConnected = false;

    ws.onopen = () => {
        console.log('open connection')
    }
    ws.onclose = () => {
        console.log('close connection')
    }

    ws.addEventListener("message", async (event) => {
        const data = JSON.parse(event.data);

        if (isConnectedRef.current) {
            if (data.metadata.subscription_type === "channel.chat.message") {
                console.log(data);
                temp.push({
                    user: data.payload.event.chatter_user_name,
                    message: data.payload.event.message.text
                })
                setTemp([...temp]);
            }
        }
        else {
            const session_id = data.payload.session.id;
            const res = await subscribeMessage(session_id);
            // isConnectedRef.current = true;
            console.log(res);
        }
        
    });
    // const res = await getData('http://localhost:8001', {
    // })
    // console.log(res)

    // websocketRef.current = ws;
}

const subscribeMessage = (session_id: string, user_id, user_token, client_id) => {
    return new Promise((resolve, reject) => {
        const data = {
            type: "channel.chat.message",
            version: "1",
            condition: {broadcaster_user_id:user_id, user_id: user_id},
            transport: {method:"websocket",session_id: session_id}
        };
        
    
        fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user_token}`, 'Client-Id': client_id }}
        )
        .then((response) => resolve(response.json()))
        .catch(err => {
            console.log(err);
            reject(undefined);
        })
    })
}