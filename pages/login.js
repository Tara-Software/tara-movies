import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { getUserAuth } from "../lib/auth";
import encrypt_password from "../lib/encrypt";


export default function Login({username}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();
    
        
    useEffect(() => {
        router.prefetch("/browse")
    })
    const outFocus = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        if(!e.target.value) {
            label.classList.remove("set")
        }
    }
    const focusInput = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        label.classList.add("set")
    }
    const handleLogin = async (e) => {
        e.preventDefault()
        const hashed_password = encrypt_password(password)
        let payload = {email: email, password: hashed_password}
        

        try {
            const response = await fetch("/api/auth/login", {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            if(response.ok) {
            }
            
            router.push("/browse")
        } catch(error) {
            console.log(error)
        }
    }
    return ( 
        <div>
            <Navigation username={username} />
            <div className="container">
                <div className="form-container center">
                    <h1>Inicia sesión</h1>
                    <form onSubmit={handleLogin}>
                        
                        <div className="input-wrapper">
                            <div className="input-wrapper-relative">
                                <label className="input_email">
                                    <input type="text" id="email" onBlur={outFocus} onFocus={focusInput} onChange={(e) => (setEmail(e.target.value))} required={true}/>
                                    <label className="place-label" id="email-label" htmlFor="email">Correo electrónico</label>
                                </label>
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <div className="input-wrapper-relative">
                                <label className="input_password">
                                    <input type="password" id="password" onFocus={focusInput} onBlur={outFocus} onChange={(e) => (setPassword(e.target.value))} required={true}/>
                                    <label className="place-label" id="password-label" htmlFor="password">Contraseña</label>
                                </label>
                            </div>
                        </div>
                        <button className="submit-form" >Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const isAuthenticated = await getUserAuth(ctx)
    if(isAuthenticated) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    return { props: {
        username: ""
    }}
}