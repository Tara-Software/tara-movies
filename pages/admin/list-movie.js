import Head from "next/head"
import Navigation from "../../components/Navigation"
import { getAllMovies } from '../../lib/movies'
import Link from 'next/link'

export default function AdminPanel(props) {
    const deleteMovie = async (id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/delete`, {
            method: 'POST',
            body: JSON.stringify({id: id})
        });
        if(res.status == 200) {
            document.getElementById(`item_${id}`).style.display = "none";
        }
    }
    return (
        <>
        <Head>
            <title>Películas en la base de datos</title>
        </Head>
        <Navigation username="Admin"/>
        <main className="padding-10">
            <ul className="list-movies no-padding" style={{color: "White"}}>
                {props.movies.map((movie, index) => {
                    return <>
                        <li key={index} id={`item_${movie.id}`} style={{position:"relative", display: "flex", alignItems: "center", backgroundColor:"#003c52", margin: "10px 0", borderRadius:"5px"}}>
                            <div style={{display: "inline-block"}}><img className="movie-thumbnail" src={movie.thumbnail}></img></div>
                            <Link href={`/admin/edit/${movie.id}`}><a><span style={{marginLeft: "10px"}}>{movie.title}</span></a></Link>
                            <span onClick={() => deleteMovie(movie.id)} style={{cursor: "pointer",position:"absolute", right:"2em"}}>Borrar</span>
                        </li>
                    </>
                })}
            </ul>
        </main>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const movies = await getAllMovies();

    return { props: {movies}}
}
