import { useRouter } from "next/router";
import { useState } from "react";
import Navigation from "../../components/Navigation";
import { getUserAuthorization } from "../../lib/auth";
import Head from 'next/head'

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
        body.append("file", avatar);
        
        try {
            const response = await fetch(`http://localhost:3000/api/auth/update`, {
                method: 'POST',
                body
            });
            if(response.ok) {
                const data = await response.json()
                console.log("todo bien")

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
                <div className="form-container">
                <h1>Hola {params} :)</h1>
                <p>Demo page: puedes hacer cosas pero de poco sirve la verdad</p>

                    <form onSubmit={handleUpdate}>
                        
                        <div className="input-wrapper">
                            <div className="input-wrapper-relative">
                                <label className="input_username">
                                <input type="text" id="username" maxLength="15" value={username} pattern="^\S+$" title="Solo se permiten 15 letras sin espacios" onBlur={outFocus} onFocus={focusInput} onChange={(e) => setUsername(e.target.value)} required/>
                                    <label className={username ? "place-label set" : "place-label"} id="username-label" htmlFor="username">Nombre de usuario</label>
                                </label>
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <div className="input-wrapper-relative">
                                <label className="input_email">
                                    <input type="email" id="email" value={user.email} onFocus={focusInput} onBlur={outFocus} disabled={true}/>
                                    
                                    <label className="place-label set" id="email-label" htmlFor="email">Correo electrónico</label>
                                </label>
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <div className="input-wrapper-relative">
                                <label className="input_avatar">
                                    <input type="file" id="avatar" onFocus={focusInput} onBlur={outFocus} onChange={uploadToClient}/>
                                    <label className="place-label set" id="avatar-label" htmlFor="avatar">Avatar</label>
                                </label>
                            </div>
                        </div>
                        <button className="submit-form">Guardar cambios</button>
                    </form>
                </div>
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
