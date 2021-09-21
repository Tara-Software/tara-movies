import cors, { runMiddleWare } from '../../../lib/middleware';
import prisma from '../../../lib/prisma';

// const prisma = new PrismaClient()

export default async function handle(req, res) {
    await runMiddleWare(req, res, cors);

    const data = JSON.parse(req.body);

    const watchlist = await prisma.user.update({
        where: {
            email: data.email
        },
        data:{
            watchlists: {
                create: [
                    {
                        movie: {
                            connect: {
                                id: data.movie
                            }
                        }
                    }
                ]
            }
        }
        
    })
    if(watchlist) {
        return res.status(200).json(watchlist)
    }
    else {
        return res.status(404).json()
    }
}