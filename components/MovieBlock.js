import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';


export default function MovieBlock({title, description, url, thumbnail, watchlist, email}) {
  const [inWatchlist, setInWatchlist] = useState(watchlist)
  const url_preview = "/movie/" + url + "/preview"
  const url_movie = "/movie/" + url + "/play"
  var descritpion_short = description ? description.substring(0,150) + "..." : ""
  
  const addToWatchList = async (e) => {

    const addedtowatchlist = await fetch("http://localhost:3000/api/movie/wannawatch", {
        method: 'POST',
        body: JSON.stringify({email: email, movie: url})
    })
    if(addedtowatchlist.status == 200) {
      setInWatchlist(true)
    }
  }
  const removeWatchList = async (e) => {
    const removed = await fetch("http://localhost:3000/api/movie/removewatchlist", {
      method: 'POST',
      body: JSON.stringify({email: email, movie: url})
    })
    if(removed.status == 200) {
      setInWatchlist(false)
    }
  }
    return (
        <li className="movie-item">
          <div className="movie-item-thumbnail">
            <Link href={url_preview}><a>
              <Image src={thumbnail ? thumbnail : "/images/default.png"} width="300px" height="170px"/>
            </a></Link>
            
          </div>
          <div className="movie-item-hover">
            <div className="movie-item-movie-controls">
              <div className="movie-item-play-button">
                <Link href={url_movie}>
                  <a><img className="movie-item-play-button-img" src="/images/icons/play.svg"></img>Reproducir</a>
                </Link>
              </div>
              <div className="movie-item-add-watchlist">
                {!inWatchlist &&
                <>
                  <img src={"/images/icons/add-outline.svg"} onClick={addToWatchList} />
                  <div className="movie-item-add-watchlist-hover">Add to watchlist</div>  
                </>
                }
                {inWatchlist && 
                  <>
                  <img src={"/images/icons/close-outline.svg"} onClick={removeWatchList} />
                  <div className="movie-item-add-watchlist-hover">Remove from watchlist</div>  
                  </>
                }
              </div>
            </div>
            <div className="movie-item-data padding">
              <span className="movie-item-title">{title}</span>
              <span className="movie-item-description">{descritpion_short}</span>
            </div>
            
          </div>
          </li>
        )
}