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
    const handleWatchlist = (e) => {
        inWatchlist ? removeWatchList(e) : addToWatchList(e)
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
            <div className="relative-wrapper">
                <div className="preview-image-wrapper">
                    <Link href={`/movie/${data.id}/play`} >
                            <div className="reproducir-wrapper ">
                                <div className="reproducir-content">
                                <div className="reproducir-img"><img width="30" height="30" src="/images/icons/play-white.svg" /></div>
                                </div>
                            </div>
                    </Link>
                    <div className="preview-image mask"><img src={data.thumbnail}/></div>
                </div>
                <div className="preview-wrapper padding">
                    <div className="title-actions-wrapper">
                        <span id="movie-title">{data.title}</span>
                        <div className="movie-actions-wrapper">
                            <div className="secondary-actions">
                                <div className="action-movie-wrapper">
                                    <div onClick={handleWatchlist} className={inWatchlist ? "action-movie-button rotate" : "action-movie-button"}>
                                        <img width="30" height="30" src="/images/icons/add-circle-outline-white.svg" alt={inWatchlist ? "Quitar de la lista" : "Añadir a la lista"} title={inWatchlist ? "Quitar de la lista" : "Añadir a la lista"}></img>
                                    </div>

                                </div>
                                {/* <div className="action-movie-wrapper">
                                    <div className="action-movie-button" onClick={() => shareThis(window.location)}>
                                        <img width="30" height="30" src="/images/icons/share-social-outline-white.svg"></img>
                                    </div>
                                    <span className="action-movie-span"><b>Compartir</b></span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                
                    <div className="movie-data-list">
                        <span className="movie-data-list-item">Dirigida por: <span className="movie-data-list-value">{parseDirector()}</span></span>
                        {/* <span className="movie-data-list-item">R:</span> */}
                        <span className="movie-data-list-item genres"><span className="movie-data-list-value">{parseGenre()}</span></span>
                        <span className="movie-data-list-item">Subtítulos</span>
                        <span className="movie-data-list-item">Idiomas de audios</span>
                    </div>
                </div>
            </div> 
            <div className="movie-description">
                <span className="movie-description-title">Resumen</span>
                <p className="data-description">{data.description || "Erase una vez en un reino muy muy lejano..."}</p>
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