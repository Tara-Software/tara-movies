import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';


export default function MovieBlock({title, description, url, thumbnail, watchlist, email}) {
  const [inWatchlist, setInWatchlist] = useState(watchlist)
  const url_preview = "/movie/" + url + "/preview"
  const url_movie = "/movie/" + url + "/play"
  var description_short = description ? description.substring(0,150) + "..." : ""
  
  const addToWatchList = async (e) => {

    const addedtowatchlist = await fetch(`http://localhost:3000/api/movie/wannawatch`, {
        method: 'POST',
        body: JSON.stringify({email: email, movie: url})
    })
    if(addedtowatchlist.status == 200) {
      setInWatchlist(true)
    }
  }
  const removeWatchList = async (e) => {
    const removed = await fetch(`http://localhost:3000/api/movie/removewatchlist`, {
      method: 'POST',
      body: JSON.stringify({email: email, movie: url})
    })
    if(removed.status == 200) {
      setInWatchlist(false)
    }
  }
  const handleMouseOver = (e) => {
    var over = e.target;
    var closest = over.closest('.movies')
    closest.classList.add("hovering")
  }
  const handleMouseLeave = (e) => {
    var over = e.target;
    var closest = over.closest('.movies')
    closest.classList.remove("hovering")
  }
    return (
        <li className="movie-item" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
          <div className="movie-item-thumbnail">
            <Link href={url_preview}>
                            <img src={thumbnail ? thumbnail : "/images/default.png"}/>
            </Link>
            
          </div>
          <div className="movie-item-hover">
            <div className="movie-item-movie-controls">
              <div className="movie-item-play-button">
                <Link href={url_movie}>
                  <a>
                    <div className="movie-item-play-button-img">
                      <img className="play-normal" src="/images/icons/play-circle-outline-white.svg"></img>
                      <img className="play-hover" src="/images/icons/play-circle-outline-hover.svg"></img>
                    </div>
                    <span className="movie-item-play-button-text">Reproducir</span></a>
                </Link>
              </div>
              <div className="movie-item-add-watchlist">
                {!inWatchlist &&
                <>
                  <img src={"/images/icons/add-outline-white.svg"} onClick={addToWatchList} />
                  <div className="movie-item-add-watchlist-hover"><b>Añadir a la lista</b></div>  
                </>
                }
                {inWatchlist && 
                  <>
                  <img src={"/images/icons/close-outline-white.svg"} onClick={removeWatchList} />
                  <div className="movie-item-add-watchlist-hover"><b>Quitar de la lista</b></div>  
                  </>
                }
              </div>
            </div>
            <div className="movie-item-data padding">
              <span className="movie-item-title">{title}</span>
              <span className="movie-item-description">{description_short}</span>
            </div>
            
          </div>
          </li>
        )
}