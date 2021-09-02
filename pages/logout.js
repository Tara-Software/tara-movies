import nookies from 'nookies'

export default function Logout() {


    return null;
}

export async function getServerSideProps(ctx) {
    
    const cookie = nookies.get(ctx)
    if(cookie.accessToken) {
        try {
            const destroyed = await fetch(`${env("API_URL")}/api/auth/logout`, {
            method: 'POST',
            body: JSON.stringify(cookie.accessToken)
            })
            console.log(destroyed)
        } catch(e) {
            console.log(e)
        } finally {
            nookies.destroy(ctx, 'accessToken', {path: "/"});
        }
        
    }
    return {
        redirect:  {
            destination: '/',
            permanent: false
        }
    }
}