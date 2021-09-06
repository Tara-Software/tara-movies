import Navigation from "../../../components/Navigation";
import { getUserAuth } from "../../../lib/auth";
import { getMovieData } from "../../../lib/movies";
import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from "react";

export default function Movie({ user, movie, data}) {
    const [inWatchlist, setInWatchlist] = useState(false)

    useEffect(() => {
        const moviesInWatchlist = user.watchlists.map((object) => object.movie.id)
        setInWatchlist(moviesInWatchlist.includes(movie))
    }, [])

    const addToWatchList = async (e) => {

        const addedtowatchlist = await fetch(`http://localhost:3000/api/movie/wannawatch`, {
            method: 'POST',
            body: JSON.stringify({email: user.email, movie: movie})
        })
        setInWatchlist(true)
    }

    const removeWatchList = async (e) => {
        const removed = await fetch(`http://localhost:3000/api/movie/removewatchlist`, {
        method: 'POST',
        body: JSON.stringify({email: user.email, movie: movie})
        })
        if(removed.status == 200) {
        setInWatchlist(false)
        }
    }
    return (
        <>
        <Head>
            <title>{data.title} | Tara Movies</title>
            <meta type="description" content="Página de previsualización"></meta>
        </Head>
        <Navigation username={user.name} avatar={user.avatar} />
        <main className="padding-10 main" style={{width: '100%'}}>
                <div className="preview-wrapper">
                    <h1 id="movie-title">{data.title}</h1>
                    <div className="movie-resumen">
                        <span>IMDB 6,6 2 h 9 min 2020 X-Ray HDR UHD 13</span>
                    </div>
                    <p className="data-description">{data.description || "Erase una vez en un reino muy muy lejano..."}</p>
                    <div className="movie-data-list">
                        <span className="movie-data-list-item">Dirección</span>
                        <span className="movie-data-list-item">Reparto</span>
                        <span className="movie-data-list-item">Géneros</span>
                        <span className="movie-data-list-item">Subtítulos</span>
                        <span className="movie-data-list-item">Idiomas de audios</span>
                    </div>
                    <div className="movie-actions-wrapper">
                        <Link href={`/movie/${data.id}/play`} >
                            <div className="reproducir-wrapper">
                                <img className="reproducir-img" width="45" height="auto" src="/images/icons/play.svg" />
                                <span className="reproducir-text">Reproducir</span>
                            </div>
                        </Link>
                        {inWatchlist && 
                        <>
                            <div onClick={removeWatchList} className="watchlist-button">
                                <img width="40" height="40" src="/images/icons/close-outline.svg"></img>
                                <div className="watchlist-button-hover">Remove from watchlist</div>  

                            </div>
                        </>
                        }
                        {!inWatchlist && 
                        <>
                            <div onClick={addToWatchList} className="watchlist-button">
                                <img width="40" height="40" src="/images/icons/add-outline.svg"></img>
                                <div className="watchlist-button-hover">Add to watchlist</div>  

                            </div>
                        </>
                        }
                    </div>
                    <div className="preview-image-wrapper">
                        <div className="preview-image"><img src={data.thumbnail}/></div>
                    </div>
                </div>
        </main>
        </>
    )
}
export async function getServerSideProps(ctx) {
    const isAuthenticated = await getUserAuth(ctx);
    if(!isAuthenticated) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    } else {
        const data = await getMovieData(ctx.params.id);
        
        return {props: {user: isAuthenticated.user, movie: ctx.params.id, data: data}}
    }
}