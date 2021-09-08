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
           <fieldset>
               <legend>¿Qué queremos hacer hoy?</legend>
               <div ><Link href="/admin/add-movie"><a><div className="submit-form tara-button" style={{width: "250px"}}>Subir una nueva película</div></a></Link></div>
           </fieldset>

           

        </main>
        </>
    )
}