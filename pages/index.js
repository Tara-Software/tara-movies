import Navigation from "../components/Navigation"
import Link from "next/link";
import Head from 'next/head';
import { getUserAuth } from "../lib/auth"
export default function Index() {
    return (
        <>  
            <Head>
                <title>Tara Movies</title>
                
            </Head>
            {/* <Navigation /> */}
            <main className="welcome-page">
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
                <div className="welcome-page-wrapper">
                    <div className="welcome-navigation">
                        <div className="welcome-navigation-text">
                            {/* <div className="welcome-navigation-img"><img width="64" height="64" src="/tara-software.svg" /></div> */}
                            <span>Welcome to</span>
                            <div className="tara-movies-wrapper"><img src="tara-movies-text.svg"></img></div>
                            <span className="welcome-subtitle">Donde seguramente todas las películas sean de Barbie.</span>
                        </div>
                    </div>
                    <div className="welcome-page-content">
                        <div className="welcome-page-text">
                            {/* <span className="welcome-title">Descubre un <b>nuevo modo</b> de ver películas.</span><br /> */}
                            
                        </div>
                        <div className="welcome-page-signup">
                            {/* <span className="welcome-page-label">me quierEs???</span> */}
                            <Link href="/signup"><span className="welcome-page-button tara-button"><b>Comenzar</b></span></Link>
                            <div className="alternative-auth">
                                <span>¿Ya te has registrado? <Link href="/login">Inicia sesión.</Link></span>
                            </div>
                        </div>
                        
                    </div>
                    
                    

                </div>
            </main>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const isAuthenticated = await getUserAuth(ctx); 
    if (isAuthenticated) {
        return {
            redirect: {
                destination: "/browse",
                permanent: false
            }
        }
    } else {
        return { props: {}}
    }
}