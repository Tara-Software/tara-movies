import Head from "next/head"
import { useState } from "react"
import Navigation from "../../components/Navigation"
import { getUserAuthorization } from "../../lib/auth"
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

    
    const feedDB = async (e) => {
        e.preventDefault()
        const body = new FormData();

        body.append("title", title);
        body.append("description", description);
        body.append("thumbnail", thumbnail);
        body.append("director", director);
        body.append("genres", genres);

        const res = await fetch(`http://localhost:3000/api/feed`,{
            method: 'POST',
            body
        })
        // Obtenemos el id para que se llame así el archivo mp4
        const { id } = await res.json();
        const video_form = new FormData();
        video_form.append("video", video, id + '.mp4');
        try {    
            var response = await fetch("http://localhost:3000/api/video_to_server", {
                body: video_form,
                method: 'POST'
            });
            if(response.status == 200) {
                document.getElementById("add-movie-form").reset();
                document.getElementById("success-uploading").style.display = "block"
            } else {
                document.getElementById("error-uploading").style.display = "block"
            }
        } catch(error) {
            console.log(error)
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

            setVideo(i);
            setCreateObjectVideoURL(URL.createObjectURL(i));
        }
    }

    return (
        <>
        <Head>
            <title>Feed movies to the DB GOD</title>
        </Head>
        <Navigation username="Admin"/>
        <main className="padding">
            <h2>Elegir película para ir tirando</h2>
            <form onSubmit={feedDB} id="add-movie-form">
                <div id="success-uploading" style={{display:"none"}}>Succesión!!</div>
                <div id="error-uploading"style={{display:"none"}}>Algo no ha ido como esperaba</div>
                <div className="form-input-div">
                    <label htmlFor="file">Choose movie</label><br />
                    <input className="tara-input" type="file" required onChange={uploadVideo} name="video" id="file"></input>
                </div>
                <div className="form-input-div">
                    <input className="tara-input" type="text" required onChange={(e) => setTitle(e.target.value)} placeholder="Title"></input>
                </div>
                <div className="form-input-div">
                    <textarea className="tara-input" onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
                </div>
                <div className="form-input-div">
                    <input className="tara-input" type="text" placeholder="Elige o escribe un director nuevo" id="director_input" onChange={(e) => setDirector(e.target.value)} list="director" />
                        {/* Get directors from PRISMA */}
                        <datalist id="director">
                            {props.directors.map((director) => {
                                return <option key={director.id} value={director.name} />
                            })}
                        </datalist>
                </div>
                <div className="form-input-div">
                    <input className="tara-input" type="text" placeholder="Nuevos géneros!!" list="genre" onChange={(e)=> setGenres(e.target.value)} />
                        {/* Get genres from PRISMA */}
                        <datalist id="genre">
                            {props.genres.map((genre) => {
                                return <option key={genre.id} value={genre.name} />
                            })}
                        </datalist>
                </div>
                <div className="form-input-div">
                    <label>Miniatura</label><br />
                    <input className="tara-input" type="file" onChange={uploadToClient}></input>
                </div>
                <input className="tara-button" type="submit" value="Submit"></input>
            </form>
        </main>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const genres = await getAllGenres();
    const directors = await getAllDirectors(); 

    return { props: {genres, directors}}
}
