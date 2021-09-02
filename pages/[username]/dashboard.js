import { useRouter } from "next/router";
import { useState } from "react";
import Navigation from "../../components/Navigation";
import { getUserAuthorization } from "../../lib/auth";
import Head from 'next/head'

export default function ControlPanel({user, params}) {

    // const [username, setUsername] = useState(() => (user.name || ""))
    // const [avatar, setAvatar] = useState(() => (user.avatar || ""))
    // const router = useRouter(); 


    return (    
        <>
        <Head>
            <title>{user.name} | Dashboard </title>
            <meta type="description" content="user dashboard"></meta>
        </Head>
        <Navigation username={user.name} avatar={user.avatar} />
        <div className="container padding">
            <h2>Si claro tú te crees que va a haber algo aquí??</h2>
            <p>No hijo no</p>
        </div>
        </>
    )
}
export async function getServerSideProps(ctx) {
    const user = await getUserAuthorization(ctx);
    if(user.status == 401) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    } else if(user.status == 403) {
        return {
            redirect: {
                destination: '/browse',
                permanent: false
            }
        }
    } 
    return { props: { user, params: user.name}}
}
