import  { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handle(req, res) {
    const data = JSON.parse(req.body)

    if(!data) {
        return  res.status(404).send("");
    }
    const response = await prisma.session.update({
        where: {
            accessToken: data
        }, 
        data: {
            has_expired: "true"
        }
    });

    return res.status(200).send("")
}