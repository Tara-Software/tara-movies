import fs from 'fs'
import formidable from "formidable";
import prisma from '../../lib/prisma';
import cors, { runMiddleWare } from '../../lib/middleware';

// const prisma = new PrismaClient()

export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handle(req, res) {
    await runMiddleWare(req, res, cors);


    const form = formidable.IncomingForm();
    
    var movie = await new Promise(function(resolve, reject) {
        form.parse(req, async function(err, fields, files) {
        let thumbnail = "default.png"
        try {
            // Search for a director or create one
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

            const prisma_response = await prisma.movie.create({
                data: {
                    title: fields.title,
                    description: fields.description,
                    location: "en el otro server",
                    director: {
                        connect: {
                            name: director.name
                        }
                    },
                    genres: {
                    create: genres
                    }
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
                    thumbnail: `/moviethumbnail/${prisma_response.id}`
                }
            })
            resolve(prisma_response)
        } catch(error) {
            console.error(error)
            reject(error)
            return res.status(401).json({error: "Algo has hecho mal en la subida del video."})
        }
        
        }); // parse
    }); // promise
    return res.json({id: movie.id})
}
export const getGenres = async genres_list => {
    const res = []
    const list = genres_list.split(",")
    for(let genre of list) {
        genre = genre.toLowerCase().trim()
        let response = await prisma.genre.findUnique({
            where: {
                name: genre
            }
        })
        if(!response) {
            response = await prisma.genre.create({
                data: {
                    name: genre
                }
            });
        }
        res.push({
                "genre": {
                    "connect": {
                        "id": response.id }
                    }
                }
                );
    }
    return res;
}