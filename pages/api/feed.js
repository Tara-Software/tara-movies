import fs from 'fs'
import formidable from "formidable";
import prisma from '../../../lib/prisma';

// const prisma = new PrismaClient()

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handle(req, res) {
    const directory = "/videos/"

    const form = formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {
        let thumbnail = "default.png"
        if(files.thumbnail !== undefined) {
            thumbnail = files.thumbnail.name
        }
        const movie = await prisma.movie.create({
            data: {
                title: fields.title,
                description: fields.description,
                location: fields.dir,
                thumbnail: '/images/' + thumbnail, 

            }
        })
        if(movie) {
            await saveFile(files.thumbnail, thumbnail);
            return res.status(200).json()
        }
        return res.status(500)
    })
}

const saveFile = async (file, id) => {
    if (file === undefined) {
        return;
    }
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`./public/images/${id}`, data);
    await fs.unlinkSync(file.path)
    return;
}