import prisma from "../../../lib/prisma";
import formidable from "formidable";
import { getGenres, saveFile } from "../feed";
import cors, { runMiddleWare } from "../../../lib/middleware";

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handle(req, res) {
    await runMiddleWare(req, res, cors);

    if(req.method == 'POST') {
        var id;
        const form = formidable.IncomingForm();
        var movie = await new Promise(function(resolve, reject) {
            form.parse(req, async function(err, fields, files) {
                try { 
                    let director = await prisma.director.findUnique({
                        where: {
                            name: fields.director
                        }
                    });
                    if(director == null) {
                        console.log("Creando director")
                        director = await prisma.director.create({
                            data: {
                                name: fields.director
                            }
                        })
                    }
                    const genres = await getGenres(fields.genres)
                    // TODO Actualizar géneros
                    const res = await prisma.movie.update({
                        where: {
                            id: fields.id
                        },
                        data: {
                            title: fields.title,
                            description: fields.description,
                            location: "en el otro server",
                            director: {
                                connect: {
                                    name: director.name
                                }
                            },
                        }
                    });
                    var thumbnail = "/videos/thumb/default"
                    if(files.thumbnail !== undefined) {
                        thumbnail = fields.id + files.thumbnail.name.split(".")[1]
                    }
                    console.log(thumbnail)
                    const add_thumb = await prisma.movie.update({
                        where: {
                            id: fields.id
                        },
                        data: {
                            thumbnail: `/videos/thumb/${fields.id}`
                        }
                    })
                    id = add_thumb.id
                    resolve()
                }
                catch(error) {
                    console.log(error)
                    reject(error)
                    return res.status(401).json({error:"Algo falló pues"})
                }
            }); // Parse
        }); // Promise
        return res.status(200).json({id:id})
    }
}