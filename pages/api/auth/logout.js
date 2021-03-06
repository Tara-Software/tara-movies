import cors, { runMiddleWare } from '../../../lib/middleware';
import prisma from '../../../lib/prisma';

// const prisma = new PrismaClient()

export default async function handle(req, res) {
    await runMiddleWare(req, res, cors);

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