import fs from 'fs'
import formidable from "formidable";
import prisma from '../../lib/prisma';

// const prisma = new PrismaClient()

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handle(req, res) {

    const form = formidable.IncomingForm();
    
    var movie = await new Promise(function(resolve, reject) {
        form.parse(req, async function(err, fields, files) {
        let thumbnail = "default.png"
  
        try {
            const prisma_response = await prisma.movie.create({
                data: {
                    title: fields.title,
                    description: fields.description,
                    location: "en el otro server",
                }
            }); // movie
            if(files.thumbnail !== undefined) {
                thumbnail = prisma_response.id + files.thumbnail.name.split(".")[1]
            }
            const add_thumb = await prisma.movie.update({
                where: {
                    id: prisma_response.id
                },
                data: {
                    thumbnail: "/images/" + thumbnail
                }
            })
            await saveFile(files.thumbnail, thumbnail)
            resolve(prisma_response)
        } catch(error) {
            reject(error)
        }
        
        }); // parse
    }); // promise
    return res.json({id: movie.id})
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