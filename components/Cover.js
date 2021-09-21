import Link from 'next/link'
export default function Cover(props) {
    const movie = props.movie;
    return (
        <div className="cover-wrapper">
            <div className="cover-title">{props.title}</div>
                <Link href={`/movie/${movie.id}/preview`}>
                    <div className="cover-img mask">
                    <Link href={`/movie/${movie.id}/play`} >
                        <div className="reproducir-wrapper ">
                            <div className="reproducir-content">
                                <div className="reproducir-img"><img width="30" height="30" src="/images/icons/play-white.svg" /></div>
                            </div>
                        </div>
                    </Link>
                    <img className="cover-img-background" src={movie.thumbnail}></img>
                </div>
            </Link>
            <div className="cover-data">
                <div className="cover-data-title">
                    {movie.title}
                </div>
                <div className="cover-data-description">
                    {movie.description}
                </div>
            </div>
        </div>
    )
}