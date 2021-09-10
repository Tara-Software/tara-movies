import Head from "next/head"
import { useState } from "react"

export default function AdminPanel() {
    const [ video, setVideo ] = useState(null);
    const [ createObjectURL, setCreateObjectURL ] = useState(null);
    
    const handleSubmit = async event => {
        event.preventDefault();
        const body = new FormData();

        body.append("video", video);
        const response = await fetch("${process.env.API_URL}/api/test",
        {
            body,
            method: 'POST'
        });

        console.log(response)
    }
    const uploadToClient = event => {
        if(event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setVideo(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    }
    return (
        <>
        <Head>
            <title>Feed movies to the DB GOD</title>
        </Head>
        <main className="padding">
            <h2>ESTO ES UN TEST</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-div">
                    <label htmlFor="file">Choose movie</label><br />
                    <input type="file" name="video" id="file" onChange={uploadToClient} ></input>
                </div>
                
                <input type="submit" value="Submit"></input>
            </form>
        </main>
        </>
    )
}