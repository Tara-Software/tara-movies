import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from 'fs';


const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handle(req, res) {
    const form = formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {
        let imageName = "default.png";
        if(files.file !== undefined) {
            imageName = fields.username + "." + files.file.name.split(".")[1]
        }
        const user = await prisma.user.update({
            where: {
                email: fields.email
            },
            data: {
                name: fields.username,
                avatar: `/images/avatar/${imageName}`
            }
        })
        if(user) {
            await saveFile(files.file, imageName);
            return res.status(200).send({username: fields.username});
        }
    });

    
    // Catch el error de que intente usar un usuario que ya exista
    // const user = await prisma.user.update({
    //     where: {
    //         email: data.email
    //     }, 
    //     data: {
    //         name: data.name,
    //         avatar: data.avatar
    //     }
    // })
    // if(user) {
    //     const newName = {
    //         username: data.name,
    //         // username: data.name,
    //         // email: email,  
    //         // password: password,
    //         // token: sessionToken,
    //         // accessToken: accessToken,
    //         // expires: expirationDate
    //     }
    //     return res.json(newName)
    // }
    // return res    
}
const saveFile = async (file, id) => {
    if(file === undefined) {
        return;
    }
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`./public/images/avatar/${id}`, data);
    await fs.unlinkSync(file.path);
    return; 
}