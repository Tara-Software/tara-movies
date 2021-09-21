import { useEffect, useState } from "react";
import MovieBlock from "./MovieBlock";

export default function MovieSection(props) {
    const [ showSlider, setShowSlider ] = useState(null)
    const moviesInWatchlist = props.user.watchlists.map((object)=> object.movie.id);
    const restriction = props.restriction != null
    useEffect(() => {
        setShowSlider(!isTouchDevice())
      }, [])
      function isTouchDevice() {
        return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
      }
    // TODO: Calcular mejor cuánto ha de moverse. Prime tiene una función muy bonita para eso pero mejor la hacemos nosotros
    // TODO: Check if no more scroll and disable??
    const getClosestScroll = (element) => {
        return element.closest('.movies').getElementsByClassName("scroll-movies")[0]
        
    }
    const scrollForward = (e) => {
        var scroll = getClosestScroll(e.target);
        scroll.scroll({
        left: scroll.scrollLeft + 231,
        behavior: 'smooth'
        })
    }
    const scrollBackwards = (e) => {
        var scroll = getClosestScroll(e.target);
        scroll.scroll({
        left: scroll.scrollLeft - 231,
        behavior: 'smooth'
        })
    }

    const renderRestriction = (restriction, restriction_value) => {
        var render = <></>
        switch(restriction) {
            case "directorId":
                render = props.movies.map((movie, index) => {
                    if(movie[restriction] == restriction_value) {
                        const inWatchlist = moviesInWatchlist.includes(movie.id)
                        return <MovieBlock key={index} email={props.user.email} title={movie.title} url={movie.id} description={movie.description} watchlist={inWatchlist} thumbnail={movie.thumbnail} />
                    }
                });
                break;
            case "genreId": 
                render = props.movies.map((movie, index) => {
                    return movie.genres.map((genre) => {
                        if(genre.genreId == restriction_value) {
                            const inWatchlist = moviesInWatchlist.includes(movie.id)
                            return <MovieBlock key={index} email={props.user.email} title={movie.title} url={movie.id} description={movie.description} watchlist={inWatchlist} thumbnail={movie.thumbnail} />
                        }
                    })
                });
                break;
            case "watchlist":
                render = props.user.watchlists.map(({movie}, index) => {
                    const inWatchlist = moviesInWatchlist.includes(movie.id)
                    return <MovieBlock key={index} email={props.user.email} title={movie.title} url={movie.id} description={movie.description} watchlist={inWatchlist} thumbnail={movie.thumbnail} />
                });
                break;
        }
        return render;
    }
    return (
    <section className="movies">
          <div className="ul-header">
              <h3 className="ul-label">{props.header}</h3>
          </div>
          <div style={{display: showSlider ? "block": "none"}} className="mobile-scroll backwards" onClick={scrollBackwards}><img src="/images/icons/chevron-forward-white.svg"></img></div>
          <ul className="no-padding scroll-movies">
            {!restriction && <>
            {props.movies.map(({id, title, description, thumbnail}) => {
              const inWatchlist = moviesInWatchlist.includes(id)
              return (
                <MovieBlock key={id} email={props.user.email} title={title} url={id} description={description} watchlist={inWatchlist} thumbnail={thumbnail}  />
                )
            })}
          </>}
          {restriction && <>
            {renderRestriction(props.restriction, props.restriction_value)}
            </>}
          </ul>
          <div style={{display: showSlider ? "block": "none"}}className="mobile-scroll" onClick={scrollForward}><img src="/images/icons/chevron-forward-white.svg"></img></div>
    </section>
    )
}