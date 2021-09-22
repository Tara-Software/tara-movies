import { useRouter } from "next/router";
import { useState } from "react";
import Navigation from "../../components/Navigation";
import { getUserAuthorization } from "../../lib/auth";
import Head from 'next/head'
import Link from 'next/link'

export default function ControlPanel({user, params}) {

    const [username, setUsername] = useState(() => (user.name || ""))
    const [avatar, setAvatar] = useState(() => (user.avatar || ""))
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const router = useRouter(); 

    const handleUpdate = async (e) => {
        e.preventDefault()
        const body = new FormData();

        body.append("username", username);
        body.append("email", user.email);
        body.append("id", user.id);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth/update`, {
                method: 'POST',
                body
            });
            if(response.ok) {
                const data = await response.json()
                console.log(data)
                // Subir avatar al otro servidor
                const form = new FormData()
                form.append('file', avatar, data.id + ".png");
                fetch(`/newavatar`, {
                    method: 'POST', 
                    body: form
                });

                router.push("/"+data.username+"/settings")
                // Poner que todo es correcto
            }
        } catch(err) {
            console.log(err)
        }
    }
    const outFocus = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        if(!e.target.value) {
            label.classList.add("set")
        }
    }
    const focusInput = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        label.classList.add("set")
    }
    const uploadToClient = (event) => {
        if(event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            
            setAvatar(i);
            setCreateObjectURL(URL.createObjectURL(i));

        }
    }

    return (    
        <>
        <Head>
            <title>{user.name} | Dashboard </title>
            <meta type="description" content="user dashboard"></meta>
        </Head>
        <Navigation username={user.name} avatar={user.avatar} />
        <div className="container padding">
            
            <div className="info-account padding-10">
                <div className="info-account-img">
                    <img src={process.env.NEXT_PUBLIC_VIDEOS_URL + user.avatar} />
                </div>
                <div className="info-account-text">
                    <span className="info-account-name">{user.name}</span>    
                    <span className="info-account-exit">Cuenta personal<Link href="/logout">
                        <a>
                            <img className="swap-icon" src="/images/icons/swap-horizontal-outline-color.svg" />
                            Cerrar sesión
                        </a></Link>
                    </span>
                </div>
            </div>            
            <section className="settings-section padding-10">
                <div className="ss-title">
                    <span>Perfil público</span>
                </div>
                <div className="">
                    <form onSubmit={handleUpdate}>
                    <div className="input-wrapper w400 avatar-input-wrapper">
                            <div className="avatar-input">
                                <img className="avatar-input-img" src={createObjectURL ? createObjectURL : `${process.env.NEXT_PUBLIC_VIDEOS_URL}${user.avatar}`} />
                                <label htmlFor="upload_avatar" className="tara-button avatar-input-button">Editar</label>
                                <input className="avatar-input hide" type="file" id="upload_avatar" onChange={uploadToClient}/>
                            </div>
                        </div>
                        <div className="input-wrapper w400">
                            <div className="input-wrapper-relative">
                                <label className="input_username">
                                <input className="tara-input" type="text" id="username" maxLength="15" value={username} pattern="^\S+$" title="Solo se permiten 15 letras sin espacios" onBlur={outFocus} onFocus={focusInput} onChange={(e) => setUsername(e.target.value)} required/>
                                    <label className={username ? "place-label set" : "place-label"} id="username-label" htmlFor="username">Nombre de usuario</label>
                                </label>
                            </div>
                        </div>
                        <div className="input-wrapper w400">
                            <div className="input-wrapper-relative">
                                <label className="input_email">
                                    <input className="tara-input disabled" type="email" id="email" value={user.email} onFocus={focusInput} onBlur={outFocus} disabled={true}/>
                                    <label className="place-label set" id="email-label" htmlFor="email">Correo electrónico</label>
                                </label>
                            </div>
                        </div>
                        <button className="submit-form tara-button w400">Guardar cambios</button>
                    </form>
                </div>
            </section>
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
