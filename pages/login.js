import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { getUserAuth } from "../lib/auth";
import encrypt_password from "../lib/encrypt";
import Link from 'next/link'


export default function Login({username}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();
    
        
    useEffect(() => {
        router.prefetch("/browse");
        for (var element of document.getElementsByClassName("tara-input")) {
            if(element.value) {
                var label = document.getElementById(element.id + "-label")
                label.classList.add("set")
            }
        }
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if(response.status == 401) {
                var error = await response.json();
                console.log(error)
                document.getElementById("error").innerText = error.error;
                document.getElementById("error").classList.add("tara-error-show");
            } else {
                router.push("/browse")    
            }
        } catch(error) {
            console.log(error)
        }
    }
    return ( 
        <div>
            <Navigation username={username} />
            <div className="container">
            <div className="welcome-mask">
                <svg  className="shape shape-top-left" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FF0066" d="M61.9,-40.2C71.7,-18.9,65,7.4,52,31.5C38.9,55.7,19.5,77.6,-0.1,77.7C-19.6,77.7,-39.3,55.9,-50.1,33C-60.9,10.2,-62.9,-13.7,-53.1,-35C-43.3,-56.4,-21.6,-75.2,2.2,-76.5C26.1,-77.8,52.2,-61.5,61.9,-40.2Z" transform="translate(100 100)" />
                </svg>
                <svg className="shape shape-right" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#08BDBA" d="M26.5,-34.2C39.1,-27.3,57.2,-25.9,56.7,-20.2C56.2,-14.4,37.1,-4.3,30.3,7.7C23.5,19.8,29,33.7,26.1,45.9C23.1,58,11.5,68.4,-3.4,73.1C-18.3,77.8,-36.6,76.7,-47.8,67.2C-59,57.7,-63.1,39.8,-57.1,26.1C-51.1,12.5,-35,3.2,-30.2,-9.3C-25.4,-21.7,-31.9,-37.3,-28.8,-47.2C-25.6,-57.2,-12.8,-61.5,-2.9,-57.4C7,-53.4,13.9,-41.1,26.5,-34.2Z" transform="translate(100 100)" />
                </svg>
                <svg viewBox="0 0 200 200" className="shape shape-last" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#BAE6FF" d="M45.1,-67.1C55.1,-54.9,57.5,-37.2,62.5,-20.6C67.6,-4,75.2,11.4,73.5,26.1C71.8,40.8,60.8,54.6,47,65.8C33.1,77.1,16.6,85.7,0.2,85.5C-16.2,85.2,-32.4,76.1,-46.8,65C-61.1,54,-73.5,41,-81,24.7C-88.5,8.5,-91,-10.9,-82.8,-24.1C-74.6,-37.2,-55.8,-44.1,-40.3,-54.5C-24.7,-65,-12.3,-79,2.6,-82.6C17.6,-86.2,35.2,-79.4,45.1,-67.1Z" transform="translate(100 100)" />
                </svg>
            </div>
                <div className="form-container center">
                    <h1>Inicia sesión</h1>
                    <div className="tara-error" id="error"></div>
                    <form onSubmit={handleLogin}>
                        
                        <div className="input-wrapper">
                            <div className="input-wrapper-relative">
                                <label className="input_email">
                                    <input className="tara-input" type="text" id="email" onBlur={outFocus} onFocus={focusInput} onChange={(e) => (setEmail(e.target.value))} required={true}/>
                                    <label className="place-label" id="email-label" htmlFor="email">Correo electrónico</label>
                                </label>
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <div className="input-wrapper-relative">
                                <label className="input_password">
                                    <input className="tara-input" type="password" id="password" onFocus={focusInput} onBlur={outFocus} onChange={(e) => (setPassword(e.target.value))} required={true}/>
                                    <label className="place-label" id="password-label" htmlFor="password">Contraseña</label>
                                </label>
                            </div>
                        </div>
                        <button className="submit-form tara-button">Iniciar sesión</button>
                    </form>
                    <div className="alternative-auth">
                        <span>¿No tienes una cuenta? <Link href="/signup">Crear cuenta.</Link></span>
                    </div>
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