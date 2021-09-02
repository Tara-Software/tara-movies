import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import hash_password from '../lib/encrypt'
import nookies from 'nookies'
import { getUserAuth } from '../lib/auth'
import Navigation from '../components/Navigation'

export default function Signup() {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ username, setUsername ] = useState('')
    const router = useRouter()
    
    useEffect(() => {
        router.prefetch("/browse")
    })
    const submitData = async e => {
        e.preventDefault()
        
        const hashed_password = hash_password(password);

        const response = await fetch(`${process.env.API_URL}/api/auth/signup`, {
            method: 'POST',
            body: JSON.stringify({name: username, email: email, password: hashed_password})
        });
        if(response && response.ok) {
            const res = await response.json()

            // Creamos una nueva sesión para el usuario maldito
            
            const session_response = await fetch(`${process.env.API_URL}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify({email:res.email, password:res.password})
            })

            if(session_response.ok) {
                router.push("/browse")
            }

        }
               
    }
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

    return (
        <>
        <Navigation username="" />
        
        <div className="container">
            <div className="form-container center">
                <h1>Registrar usuario</h1>
                <form onSubmit={submitData}>
                    <div className="input-wrapper">
                        <div className="input-wrapper-relative">
                            <label className="input_username">
                                <input type="text" id="username" maxLength="15" pattern="^\S+$" title="Solo se permiten 15 letras sin espacios" onBlur={outFocus} onFocus={focusInput} onChange={(e) => setUsername(e.target.value)} required/>
                                <label className="place-label" id="username-label" htmlFor="username">Nombre de usuario</label>
                            </label>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <div className="input-wrapper-relative">
                            <label className="input_email">
                                <input type="email" id="email"  onBlur={outFocus} onFocus={focusInput} onChange={(e) => setEmail(e.target.value)} required/>
                                <label className="place-label" id="email-label" htmlFor="email">Correo electrónico</label>
                            </label>
                        </div>
                    </div>    
                    <div className="input-wrapper">
                        <div className="input-wrapper-relative">
                            <label className="input_password">
                                <input type="password" id="password"  onBlur={outFocus} onFocus={focusInput} onChange={(e) => setPassword(e.target.value)} required/>
                                <label className="place-label" id="password-label" htmlFor="password">Contraseña</label>
                            </label>
                        </div>
                    </div>
                    <button className="submit-form">Registrar usuario</button>
                </form>
        </div></div>
        </>
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