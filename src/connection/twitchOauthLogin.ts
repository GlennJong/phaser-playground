export const openTwitchOauthLogin = (client_id: string, redirect_uri: string) => {
    const scope = ['user:read:chat', 'user:bot', 'channel:bot', 'channel:read:subscriptions', 'channel:read:redemptions'].join('+')
    const params = `response_type=token&force_verify=true&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
    window.open(`https://id.twitch.tv/oauth2/authorize?${params}`,"My Window Name", "width=400,height=400")
}