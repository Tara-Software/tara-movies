import Head from 'next/head'
import { getUserAuth } from '../lib/auth'
import Navigation from '../components/Navigation'
import MovieBlock from '../components/MovieBlock'

export async function getServerSideProps(ctx) {
  const res = await fetch('http://localhost:3000/api/movies')
  const movies = await res.json()

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
        user: isAuthenticated.user
    }
  };
}

export default function Home({ initialMovies, user }) {
  const moviesInWatchlist = user.watchlists.map((object)=> object.movie.id);
  return (
    <>
      <Head>
        <title>Tara Movies</title>
        <meta type="description" content="Discover movies for free"></meta>
      </Head>
      <Navigation username={user.name} avatar={user.avatar} />
      <main className="padding">
        <section className="movies">
          <ul className="no-padding">
            <div className="ul-header">
              <h3 className="ul-label">Descubrir</h3>
            </div>
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
      </main>
    </>
  )
}
