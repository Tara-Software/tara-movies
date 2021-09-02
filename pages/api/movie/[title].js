import fs from 'fs'
import path from 'path'

export default function handle(req, res) {
    const database_path = "/home/daiant/Documentos/VIDEO_DATABASE/"
    const video_extension = ".webm"
    var param = req.url.split("api/movie/")[1]+video_extension
    
    const filePath = path.resolve(database_path, param)
    const data = fs.createReadStream(filePath)

    data.pipe(res)

}