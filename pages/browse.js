import Head from 'next/head'
import { getUserAuth } from '../lib/auth'
import Navigation from '../components/Navigation'
import MovieBlock from '../components/MovieBlock'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getAllDirectors, getAllGenres, getAllMovies } from '../lib/movies'

export async function getServerSideProps(ctx) {
  const movies = await getAllMovies();
  const directors = await getAllDirectors();
  const genres = await getAllGenres();
  const isAuthenticated = await getUserAuth(ctx)
  if(!isAuthenticated) {
    // Si el token no es correcto o no está autenticado, a la puta calle
    return {
      redirect: {
        destination: '/signup',
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
  const moviesInWatchlist = user.watchlists.map((object)=> object.movie.id);
  const possibleRestrictions = ["directorId", "genreId"]
  const router = useRouter();
  const [ restriction, setRestriction ] = useState(router.asPath.includes("?") && router.asPath.includes("=") && Object.keys(router.query)[0] != undefined)
  var query_restriction, query_restriction_value

  if(restriction) {
    query_restriction = Object.keys(router.query)[0]
    query_restriction_value = router.query[query_restriction]
    if(!possibleRestrictions.includes(query_restriction)) {
      setRestriction(false)
    }
  }
  const parseRestriction = () => {
    var query = ""
    switch(query_restriction) {
      case "directorId":
        query = "Director: "
        var director = ""
        for(var dir of directors) {
          if(dir.id == query_restriction_value) {
            director = dir.name;
            break;
          }
        }
        query += director;
        break;
      case "genreId":
        query="Género: "
        for(var genre of genres) {
          if(genre.id == query_restriction_value) {
            query += genre.name.charAt(0).toUpperCase() + genre.name.substring(1)
            break;
          }
        }
        break;
    }
    return query
  }
  const renderRestriction = () => {
    return initialMovies.map((movie, index) => {
      switch(query_restriction) {
        case "directorId":
          if(movie[query_restriction] == query_restriction_value) {
            const inWatchlist = moviesInWatchlist.includes(movie.id)
            return <MovieBlock key={index} email={user.email} title={movie.title} url={movie.id} description={movie.description} watchlist={inWatchlist} thumbnail={movie.thumbnail} />
          }
          break;
        case "genreId":
          return movie.genres.map((genre) => {
            if(genre.genreId == query_restriction_value) {
              const inWatchlist = moviesInWatchlist.includes(movie.id)
              return <MovieBlock key={index} email={user.email} title={movie.title} url={movie.id} description={movie.description} watchlist={inWatchlist} thumbnail={movie.thumbnail} />
            }
          })
      }

    });
  }
  return (
    <>
      <Head>
        <title>Tara Movies</title>
        <meta type="description" content="Discover movies for free"></meta>
      </Head>
      <Navigation username={user.name} avatar={user.avatar} />
      <main className="main">
        {!restriction &&
        <>
        <section className="movies">
          <div className="ul-header">
              <h3 className="ul-label">Descubrir</h3>
          </div>
          <ul className="no-padding">
            
            {initialMovies.map(({id, title, description, thumbnail}) => {
              const inWatchlist = moviesInWatchlist.includes(id)
              return (
                <MovieBlock key={id} email={user.email} title={title} url={id} description={description} watchlist={inWatchlist} thumbnail={thumbnail}  />
                )
          })}
          </ul>
        </section>
        <div className="section-divider"></div>
        <section className="movies">
          <ul className="no-padding">
          <div className="ul-header medium">
              <h3 className="ul-label">Lista de reproducción</h3>
          </div>
          {
            user.watchlists.map(({movie}, index) => {
                const inWatchlist = moviesInWatchlist.includes(movie.id)
                return <MovieBlock key={index} email={user.email} title={movie.title} url={movie.id} description={movie.description} watchlist={inWatchlist} thumbnail={movie.thumbnail} />
            })
            
          }
          </ul>
        </section>
        </>}
        {restriction && <>
          <section className="movies">
            <ul className="no-padding">
              <div className="ul-header">
                <h3 className="ul-label">{parseRestriction()}</h3>
              </div>
              {renderRestriction()}
              </ul>
          </section>
        </>}
      </main>
    </>
  )
}
