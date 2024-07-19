export const getUserDataById = async(user_id, app_token, client_id) => {
    const list = await getData(`https://api.twitch.tv/helix/users?login=${user_id}`, {
        'Authorization': `Bearer ${app_token}`,
        'Client-Id': client_id
    })
    return list;
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