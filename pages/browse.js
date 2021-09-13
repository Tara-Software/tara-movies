import Head from 'next/head'
import { getUserAuth } from '../lib/auth'
import Navigation from '../components/Navigation'
import MovieBlock from '../components/MovieBlock'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getAllDirectors, getAllGenres, getAllMovies } from '../lib/movies'
import MovieSection from '../components/MovieSection'

export async function getServerSideProps(ctx) {
  const movies = await getAllMovies();
  const directors = await getAllDirectors();
  const genres = await getAllGenres();
  const isAuthenticated = await getUserAuth(ctx)
  if(!isAuthenticated) {
    // Si el token no es correcto o no está autenticado, a la puta calle
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
        initialMovies: movies,
        directors: directors,
        genres: genres,
        user: isAuthenticated.user
    }
  };
}
export default function Home({ initialMovies,directors,genres, user }) {
  const possibleRestrictions = ["directorId", "genreId"]
  const router = useRouter();
  const [ showSlider, setShowSlider ] = useState(null)
  const [ restriction, setRestriction ] = useState(router.asPath.includes("?") && router.asPath.includes("=") && Object.keys(router.query)[0] != undefined)
  var query_restriction, query_restriction_value


  if(restriction) {
    query_restriction = Object.keys(router.query)[0]
    query_restriction_value = router.query[query_restriction]
    if(!possibleRestrictions.includes(query_restriction)) {
      setRestriction(false)
    }
  }
  const parseRestriction = (restriction, value) => {
    var query = ""
    switch(restriction) {
      case "directorId":
        query = "director: "
        var director = ""
        for(var dir of directors) {
          if(dir.id == value) {
            director = dir.name;
            break;
          }
        }
        query += director;
        break;
      case "genreId":
        query="género: "
        for(var genre of genres) {
          if(genre.id == value) {
            query += genre.name.charAt(0).toUpperCase() + genre.name.substring(1)
            break;
          }
        }
        break;
    }
    return query
  }
  return (
    <>
      <Head>
        <title>Tara Movies</title>
        <meta type="description" content="Discover movies for free"></meta>
      </Head>
      <Navigation username={user.name} avatar={user.avatar} />
      <main className="main">
        {/* AQUÍ SE IRÁ METIENDO DE FORMA MANUAL LAS RESTRICCIONES Y TAL Y CUAL*/}
        
        {!restriction &&
        <>
        <MovieSection header="Descubrir" movies={initialMovies} user={user} />
        <div className="section-divider"></div>
        <MovieSection header="Lista de reproducción" movies={initialMovies} user={user} restriction="watchlist" restriction_value="1"/> 
        </>}
        {restriction && <>
          <MovieSection 
            header={`Resultados de ${parseRestriction(query_restriction, query_restriction_value)}`} 
            movies={initialMovies} 
            user={user} 
            restriction={query_restriction} 
            restriction_value={query_restriction_value}/> 
        </>}
      </main>
    </>
  )
}
