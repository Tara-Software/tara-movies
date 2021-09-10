import nookies from 'nookies'

export async function getUserAuth(ctx) {
    const cookies = nookies.get(ctx)
    if(cookies.accessToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`, {
            method:'POST',
            body: JSON.stringify({"accessToken": cookies.accessToken})
        })
        if(response.status == 200) {
            return response.json()
        }
    }
    return null
}

export async function getUserAuthorization(ctx) {
    const username = ctx.params.username;
    const data = await getUserAuth(ctx);
    if(!data) {
        return {"status": 401}
    } else {
        if(data.user.name != username) {
            return {"status": 403}
        }
    }
    return data.user;
}