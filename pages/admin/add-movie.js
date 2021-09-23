import Head from "next/head"
import router from "next/router"
import { useState } from "react"
import Navigation from "../../components/Navigation"
import { getUserAuth } from "../../lib/auth"
import { getAllGenres, getAllDirectors } from '../../lib/movies'

export default function AdminPanel(props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [ createObjectVideoURL, setCreateObjectVideoURL ] = useState(null);
    const [ video, setVideo ] = useState(null);
    const [ director, setDirector ] = useState(null);
    const [ genres, setGenres] = useState(null);
    const [ filename, setFilename] = useState(null)
    
    const feedDB = async (e) => {
        e.preventDefault()
        const body = new FormData();

        body.append("title", title);
        body.append("description", description);
        body.append("director", director);
        body.append("genres", genres);


        const res = await fetch(`/api/feed`,{
            method: 'POST',
            body
        });
        if(thumbnail) {
            const form = new FormData();
            form.append("file", thumbnail, data.id + '.png');
            fetch(`${process.env.NEXT_PUBLIC_VIDEOS_URL}/newmoviethumbnail`, {
                method: 'POST',
                body: form
            });
        }
        console.log("res status: " + res.status)
        if(res.status == 401) {
            var errorMsg = await res.json()
            var errsuc = document.getElementById("error-success");
            errsuc.classList.remove("tara-success-show")
            errsuc.classList.add("tara-error-show")
            
            errsuc.innerText = errorMsg.error
        } else {
        // Obtenemos el id para que se llame así el archivo mp4
            const { id } = await res.json();
            const video_form = new FormData();
            video_form.append("video", video, id + '.mp4');
            console.log("Id: " + id);
            try {
                var response = await fetch(`${process.env.NEXT_PUBLIC_VIDEOS_URL}/upload`, {
                    method: 'POST',
                    body: video_form
                    
                });
                console.log("response status:")
                console.log(response.status);
                if(response.status == 200) {
                    var errsuc = document.getElementById("error-success");
                    errsuc.classList.add("tara-success-show")
                    errsuc.innerText = "Todo bien!!"
                } else {
                    errsuc.classList.remove("tara-success-show")
                    errsuc.classList.add("tara-error-show")
                    errsuc.innerText = "Algo falló en la escritura del vídeo a la base de datos."
                }
            } catch(error) {
                console.log("lo de la l sale por aquí")
                console.log(error)
            }
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
    const goBack = (e) => {
        e.preventDefault();
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
            <div style={{fontSize: "1.4em", fontWeight: "bold", margin: "30px 0"}} className="w400">Elegir película para ir tirando</div>
                <div className="tara-error w400" id="error-success"></div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative input-video-wrapper">
                        <label htmlFor="file" id="file-label">
                            <img src="/images/icons/claqueta.svg" style={{filter:"invert(1)"}} className="input-video"/>
                            <span>{filename ? filename : "No se ha seleccionado ningún archivo."}</span>
                        </label>
                    </div>
                    <input className="tara-input hide" type="file" required onChange={uploadVideo} name="video" id="file"></input>
                </div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative">
                        <label className="">
                            <input className="tara-input" type="text" id="title" value={title} required onChange={(e) => setTitle(e.target.value)} onFocus={focusInput} onBlur={outFocus}></input>
                            <label className="place-label" id="title-label" htmlFor="title">Título</label>
                        </label>
                    </div>
                </div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative">
                        <label className="">
                            <textarea className="tara-input decoration" type="text" id="description" value={description} required onChange={(e) => setDescription(e.target.value)} onFocus={focusInput} onBlur={outFocus}></textarea>
                            <label className="place-label" id="description-label" htmlFor="description">Descripción</label>
                        </label>
                    </div>
                </div>
                <div className="input-wrapper w400">
                    <div className="input-wrapper-relative">
                        <label className="">
                            <input className="tara-input" type="text" id="director" list="director-list" required onChange={(e) => setDirector(e.target.value)} onFocus={focusInput} onBlur={outFocus}></input>
                            <label className="place-label" id="director-label" htmlFor="director">Director</label>
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
                            <input className="tara-input" type="text" id="genre" list="genre-list" required onChange={(e) => setGenres(e.target.value)} onFocus={focusInput} onBlur={outFocus}></input>
                            <label className="place-label" id="genre-label" htmlFor="genre">Géneros</label>
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
    return { props: {genres, directors}}
}
