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

        const addedtowatchlist = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/wannawatch`, {
            method: 'POST',
            body: JSON.stringify({email: user.email, movie: movie})
        })
        setInWatchlist(true)
    }

    const removeWatchList = async (e) => {
        const removed = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movie/removewatchlist`, {
        method: 'POST',
        body: JSON.stringify({email: user.email, movie: movie})
        })
        if(removed.status == 200) {
        setInWatchlist(false)
        }
    }
    const parseGenre = () => {
        // TODO: Link a cada uno de esos géneros
        const size = data.genres.length
        var i = 1;
        return data.genres.map((genre) => {
            let res = " "
            res += genre.name.charAt(0).toUpperCase() + genre.name.substring(1)
            
            if (i < size) {
                res += ","
                i++
            }
            return <Link key={genre.id} href={{ pathname: '/browse', query: {genreId: genre.id}}}><a><span className="link-to-browse">{res}</span></a></Link>
        })
    }
    const parseDirector = () => {
        // TODO: Link al director
        
        return data.director ? <Link href={{ pathname: '/browse', query: {directorId: data.director.id}}}><a><span className="link-to-browse">{data.director.name}</span></a></Link> : ""
    }
    const shareThis = (movie) => {
        alert(movie)
      }
    return (
        <>
        <Head>
            <title>{data.title} | Tara Movies</title>
            <meta type="description" content="Página de previsualización"></meta>
        </Head>
        <Navigation username={user.name} avatar={user.avatar} />
        <main className="main preview-main" style={{width: '100%'}}>
                <div className="preview-image-wrapper">
                    <div className="preview-image"><img src={data.thumbnail}/></div>
                </div>
                <div className="preview-wrapper padding">
                    <h1 id="movie-title">{data.title}</h1>
                    {/* <div className="movie-resumen">
                        <span>IMDB 6,6 2 h 9 min 2020 X-Ray HDR UHD 13</span>
                    </div> */}
                    <div className="movie-actions-wrapper">
                        <Link href={`/movie/${data.id}/play`} >
                            <div className="reproducir-wrapper tara-button">
                                <div className="reproducir-content">
                                <div className="reproducir-img"><img width="60" height="auto" src="/images/icons/play-circle-fill.svg" /></div>
                                <span className="reproducir-text">Reproducir película</span>
                                </div>
                            </div>
                        </Link>
                        <div className="secondary-actions">
                            {inWatchlist && 
                            <>
                            <div className="action-movie-wrapper">
                                <div onClick={removeWatchList} className="action-movie-button">
                                    <img width="50" height="50" src="/images/icons/close-outline-white.svg"></img>
                                </div>
                                <span className="action-movie-span"><b>Quitar de la lista</b></span>  
                            </div>
                            </>
                            }
                            {!inWatchlist && 
                            <>
                            <div className="action-movie-wrapper">
                                <div onClick={addToWatchList} className="action-movie-button">
                                    <img width="50" height="50" src="/images/icons/add-outline-white.svg"></img>
                                </div>
                                <span className="action-movie-span"><b>Añadir a la lista</b></span>  
                            </div>
                            </>
                            }
                            <div className="action-movie-wrapper">
                                <div className="action-movie-button" onClick={() => shareThis(window.location)}>
                                    <img width="40" height="40" src="/images/icons/share-social-outline-white.svg"></img>
                                </div>
                                <span className="action-movie-span"><b>Compartir</b></span>
                            </div>
                        </div>
                    </div>
                
                    <p className="data-description">{data.description || "Erase una vez en un reino muy muy lejano..."}</p>
                    <div className="movie-data-list">
                        <span className="movie-data-list-item">Dirección: <span className="movie-data-list-value">{parseDirector()}</span></span>
                        <span className="movie-data-list-item">Reparto</span>
                        <span className="movie-data-list-item">Géneros: <span className="movie-data-list-value">{parseGenre()}</span></span>
                        <span className="movie-data-list-item">Subtítulos</span>
                        <span className="movie-data-list-item">Idiomas de audios</span>
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