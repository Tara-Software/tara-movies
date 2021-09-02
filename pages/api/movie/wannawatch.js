import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
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