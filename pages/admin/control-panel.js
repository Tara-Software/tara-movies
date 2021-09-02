import Head from "next/head"
import { useState } from "react"

export default function AdminPanel() {
    const [dir, setDir] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [createObjectURL, setCreateObjectURL] = useState(null);

    
    const feedDB = async (e) => {
        e.preventDefault()
        console.log(dir)
        const body = new FormData();

        body.append("title", title)
        body.append("description", description)
        body.append("thumbnail", thumbnail)
        body.append("dir", dir)

        const res = await fetch(`${env("API_URL")}/api/feed`,{
            method: 'POST',
            body
        })
        if(res.status == 200) {
            console.log("oleole")
        }
    }
    const uploadToClient = (e) => {
        if(e.target.files && e.target.files[0]) {
            const i = e.target.files[0]

            setThumbnail(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    }

    return (
        <>
        <Head>
            <title>Feed movies to the DB GOD</title>
        </Head>
        <main className="padding">
            <h2>Elegir película para ir tirando</h2>
            <form onSubmit={feedDB}>
                <div className="form-input-div">
                    <label>Choose movie</label><br />
                    <input type="file" required onChange={(e) => {setDir(e.target.value.split("fakepath\\")[1].split(".")[0])}} placeholder="Dir"></input>
                </div>
                <div className="form-input-div">
                    <input type="text" required onChange={(e) => setTitle(e.target.value)} placeholder="Title"></input>
                </div>
                <div className="form-input-div">
                    <textarea onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
                </div>
                <div className="form-input-div">
                    <label>Miniatura</label><br />
                    <input type="file" onChange={uploadToClient}></input>
                </div>
                <input type="submit" value="Submit"></input>
            </form>
        </main>
        </>
    )
}