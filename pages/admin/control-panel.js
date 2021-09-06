import Head from "next/head"
import Link from "next/link"
import Navigation from "../../components/Navigation"

export default function AdminPanel() {

    return (
        <>
        <Head>
            <title>Control Panel</title>
        </Head>
        <Navigation username="Admin"/>
        <main className="padding">
           <h1>Bienvenido, administrador.</h1>
           <fielset>
               <legend>¿Qué queremos hacer hoy?</legend>
               <div><Link href="/admin/add-movie"><a><button>Subir una nueva película</button></a></Link></div>
           </fielset>
           

        </main>
        </>
    )
}