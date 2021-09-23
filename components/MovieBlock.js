import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';


export default function MovieBlock({title, description, url, thumbnail, watchlist, email}) {
  const url_preview = "/movie/" + url + "/preview"
  const url_movie = "/movie/" + url + "/play"
  return (
	<Link href={url_preview}>
		<a className="movie-item">
			<li style={{listStyle: "none"}}>
				<div className="movie-item-thumbnail">
						<img src={thumbnail ? process.env.NEXT_PUBLIC_VIDEOS_URL + thumbnail : "/images/default.png"}/>
				</div>
				<div className="movie-item-info">
					<span className="movie-item-title">{title}</span>
				</div>
			</li>
		</a>
	</Link>	
	)
}