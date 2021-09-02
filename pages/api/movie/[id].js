import fs from 'fs'
import path from 'path'

export default function handle(req, res) {
    const database_path = "/home/daiant/Documentos/VIDEO_DATABASE/"
    const movieId = req.url.split(`${process.env.API_URL}/api/movie/`)[1]
    const path = database_path + movieId + ".mp4"
    
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

    
    if(range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1
        const chunkSize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head)
        file.pipe(res)
    }
    else {
        const head = {
            'Content-Length': fileSize, 
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
}