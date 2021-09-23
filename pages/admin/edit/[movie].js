import Head from "next/head"
import router from "next/router"
import {useState } from "react"
import Navigation from "../../../components/Navigation"
import { getUserAuth } from "../../../lib/auth"
import { getAllGenres, getAllDirectors, getMovieData } from '../../../lib/movies'

export default function Edit(props) {
    const [title, setTitle] = useState(props.movie.title)
    const [description, setDescription] = useState(props.movie.description)
    const [thumbnail, setThumbnail] = useState(props.movie.thumbnail)
    const [createObjectURL, setCreateObjectURL] = useState(process.env.NEXT_PUBLIC_VIDEOS_URL + props.movie.thumbnail);
    const [ createObjectVideoURL, setCreateObjectVideoURL ] = useState(null);
    const [ video, setVideo ] = useState(null);
    const [ director, setDirector ] = useState(props.movie.director.name);
    const [ genres, setGenres] = useState(props.movie.genres.map((genre) => {return genre.name}));
    const [ filename, setFilename] = useState(null);

    const feedDB = async (e) => {
        e.preventDefault()
        const body = new FormData();
        body.append("id", props.movie.id);
        body.append("title", title);
        body.append("description", description);
        body.append("thumbnail", thumbnail);
        body.append("director", director);
        body.append("genres", genres);

        const response = await fetch(`/api/movie/update`,{
            method: 'POST',
            body
        });
        console.log(response)
        var errsuc = document.getElementById("error-success");
        if(response.status == 200) {
            const data = await response.json();
            console.log(data);
            if(thumbnail) {
                const form = new FormData();
                form.append("file", thumbnail, data.id + '.png');
                fetch(`${process.env.NEXT_PUBLIC_VIDEOS_URL}/newmoviethumbnail`, {
                method: 'POST',
                body: form
            });
            }            
            errsuc.classList.add("tara-success-show")
            errsuc.innerText = "Todo bien!!"
        } else {
            errsuc.classList.remove("tara-success-show")
            errsuc.classList.add("tara-error-show")
            errsuc.innerText = "Algo falló en la escritura del vídeo a la base de datos."
        }
    }
    const uploadToClient = (e) => {
        if(e.target.files && e.target.files[0]) {
            const i = e.target.files[0]
            
            setThumbnail(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    }
    const uploadVideo = (event) => {
        if(event.target.files && event.target.files[0]) {
            const i = event.target.files[0]
            setFilename(event.target.files[0].name)
            setVideo(i);
            setCreateObjectVideoURL(URL.createObjectURL(i));
        }
    }
    const outFocus = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        if(!e.target.value) {
            label.classList.remove("set")
        }
    }
    const focusInput = (e) => {
        var label = document.getElementById(e.target.id + "-label")
        label.classList.add("set")
    }
    const goBack = () => {
        router.push("/admin/control-panel")
    }

    return (
        <>
        <Head>
            <title>Feed movies to the DB GOD</title>
        </Head>
        <Navigation username="Admin"/>
        <main className="padding">
            
            <form onSubmit={feedDB} id="add-movie-form">
            <div style={{fontSize: "1.4em", fontWeight: "bold", margin: "30px 0"}} className="w400">Editar película</div>
                <div className="tara-error w400" id="error-success"></div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative input-video-wrapper">
                        <label id="file-label">
                            <img src="/images/icons/claqueta.svg" style={{filter: "invert(1)"}} className="input-video"/>
                            <span>{`${props.movie.id}.mp4`}</span>
                        </label>
                    </div>
                    {/* <input className="tara-input hide" type="file" required onChange={uploadVideo} name="video" id="file"></input> */}
                </div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative">
                        <label className="">
                            <input className="tara-input" type="text" id="title" value={title} required onChange={(e) => setTitle(e.target.value)} onFocus={focusInput} onBlur={outFocus}></input>
                            <label className="place-label set" id="title-label" htmlFor="title">Título</label>
                        </label>
                    </div>
                </div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative">
                        <label className="">
                            <textarea className="tara-input decoration" type="text" id="description" value={description} required onChange={(e) => setDescription(e.target.value)} onFocus={focusInput} onBlur={outFocus}></textarea>
                            <label className="place-label set" id="description-label" htmlFor="description">Descripción</label>
                        </label>
                    </div>
                </div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative">
                        <label className="">
                            <input className="tara-input" type="text" id="director" list="director-list" value={director} required onChange={(e) => setDirector(e.target.value)} onFocus={focusInput} onBlur={outFocus}></input>
                            <label className="place-label set" id="director-label" htmlFor="director">Director</label>
                        </label>
                        <datalist id="director-list">
                                {props.directors.map((director) => {
                                    return <option key={director.id} value={director.name} />
                                })}
                            </datalist>
                    </div>
                </div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative">
                        <label className="">
                            <input className="tara-input" type="text" id="genre" list="genre-list" value={genres} required onChange={(e) => setGenres(e.target.value)} onFocus={focusInput} onBlur={outFocus}></input>
                            <label className="place-label set" id="genre-label" htmlFor="genre">Géneros</label>
                        </label>
                        <datalist id="genre-list">
                            {props.genres.map((genre) => {
                                return <option key={genre.id} value={genre.name} />
                            })}
                        </datalist>
                    </div>
                </div>
                <div className="miniature-input">
                    <div className="miniature-input-wrapper">
                        <span style={{display: "block", marginBottom: "10px"}}>Añadir miniatura</span>
                        <label htmlFor="upload_miniature" className="tara-button transparent"><img className="miniature-input-img" src={createObjectURL ? createObjectURL : process.env.NEXT_PUBLIC_VIDEOS_URL +"/videos/thumb/default"} /></label>
                        <input className="miniature-input hide" type="file" id="upload_miniature" onChange={uploadToClient}/>
                    </div>
                </div>
                <div className="submit-form-upload-movie w400">
                    <button className="submit-form  tara-button w400" type="submit">Subir película</button>
                    <div style={{marginTop: "10px"}} className="submit-form cancel tara-button w400" onClick={goBack}>Cancelar</div>
                </div>
            </form>
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
    } else if(isAuthenticated.isAdmin <= 0) {
        return {
            redirect: {
                destination: "/browse",
                permanent: false
            }
        }
    }
    const genres = await getAllGenres();
    const directors = await getAllDirectors(); 
    const movie = await getMovieData(ctx.params.movie);
    return { props: {genres, directors, movie}}
}