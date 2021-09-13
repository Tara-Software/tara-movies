import MovieBlock from "../../components/MovieBlock";
import Navigation from "../../components/Navigation";
import { getUserAuthorization } from "../../lib/auth";
import Link from 'next/link'

export default function Watchlist({user, params}) {
    const movies = user.watchlists.map(({movie}, index) => {
        return movie;
    })
    const removeWatchList = async (e, id) => {
        const removed = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/removewatchlist`, {
        method: 'POST',
        body: JSON.stringify({email: user.email, movie: id})
        })
        if(removed.status == 200) {
            document.getElementById(`item_${id}`).style.display="none"
        }
    }
    return (
        <>
        <Navigation username={user.name} avatar={user.avatar} />
        <main className="padding">
        <section className="movies">
          <ul className="no-padding">
            <div className="ul-header medium">
              <h3 className="ul-label">Lista de reproducción</h3>
            </div>
        {
            user.watchlists.map(({movie}, index) => {
                return ( <li key={index} id={`item_${movie.id}`} style={{position:"relative",marginLeft :"5%",marginRight:"5%", display: "flex", alignItems: "center", backgroundColor:"#003c52", margin: "10px 0", borderRadius:"5px"}}>
                <div style={{display: "inline-block", }}><img className="movie-thumbnail" src={movie.thumbnail}></img></div>
                <Link href={`/movie/${movie.id}/preview`}><a><span style={{marginLeft: "10px"}}>{movie.title}</span></a></Link>
                <span onClick={(e) => removeWatchList(e, movie.id)} style={{cursor: "pointer",position:"absolute", right:"1em"}}><img height="30" width="30" style={{verticalAlign: "middle"}} src="/images/icons/close-outline-white.svg"></img></span>

            </li>)
            })
        }
        </ul>
        </section>
        </main>
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
