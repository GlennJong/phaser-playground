export const handleConnectToTwitch = async (user_id, user_token, client_id) => {
    let ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=60');

    let isConnected = false;

    ws.onopen = () => {
        console.log('open connection');
        // isConnected = true;
    }
    ws.onclose = () => {
        console.log('close connection')
        isConnected = false;
    }

    ws.addEventListener("message", async (event) => {
        const data = JSON.parse(event.data);
        const temp = [];

        if (isConnected) {
            if (data.metadata.subscription_type === "channel.chat.message") {
                console.log(data);
                temp.push({
                    user: data.payload.event.chatter_user_name,
                    message: data.payload.event.message.text
                })
                console.log(temp)
                // setTemp([...temp]);
            }
        }
        else {
            const session_id = data.payload.session.id;
            const res = await subscribeMessage(session_id, user_id, user_token, client_id);
            console.log('subscribed')
            isConnected = true;
            console.log(res);
        }
        
    });
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