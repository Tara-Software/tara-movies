import Navigation from "../components/Navigation"
import Link from "next/link";
import { getUserAuth } from "../lib/auth"
export default function Index() {
    return (
        <>
            <Navigation />
            <main className="welcome-page">
                <div className="welcome-page-wrapper">
                    <div className="welcome-page-content">
                        <div className="welcome-page-text">
                            <span className="welcome-title">Descubre un <b>nuevo modo</b> de ver películas.</span><br />
                            <span className="welcome-subtitle">Seguramente todas sean de Barbie.</span>
                        </div>
                        <div className="welcome-page-signup">
                            <span className="welcome-page-label">me quierEs???</span>
                            <Link href="/signup"><span className="welcome-page-button tara-button"><b>Regístrate</b></span></Link>

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