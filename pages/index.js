import Navigation from "../components/Navigation"
import { getUserAuth } from "../lib/auth"
export default function Index() {
    return (
        <>
            <Navigation />
            <h1 className="padding">Nada que ver aqui tontolabo</h1>
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