import MovieBlock from "../../components/MovieBlock";
import Navigation from "../../components/Navigation";
import { getUserAuthorization } from "../../lib/auth";

export default function Watchlist({user, params}) {
    const movies = user.watchlists.map(({movie}, index) => {
        return movie;
    })
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
                return <MovieBlock key={index} title={movie.title} url={movie.id} thumbnail={movie.thumbnail} />
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
