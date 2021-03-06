import cors, { runMiddleWare } from '../../../lib/middleware';
import prisma from '../../../lib/prisma';

// const prisma = new PrismaClient()

export default async function handle(req, res) {
    await runMiddleWare(req, res, cors);

    const data = JSON.parse(req.body)
    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    const deletedRecord = await prisma.watchlist.delete({
        where: {
            movieId_userId: {
                movieId: data.movie,
                userId: user.id
            }
        }
    })
    if(deletedRecord) {
        return res.status(200).json()
    }
    else {
        return res.status(500).json()
    }
    
}