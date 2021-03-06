import cors, { runMiddleWare } from '../../../lib/middleware';
import prisma from '../../../lib/prisma';

// const prisma = new PrismaClient()
export default async function handle(req, res) {
    await runMiddleWare(req, res, cors);

    const { accessToken } = JSON.parse(req.body)
    const user = await prisma.session.findMany({
        where: {
            accessToken: accessToken,
            has_expired: "false"
        }, 
        select: {
            accessToken: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    isAdmin: true,
                    email: true,
                    avatar: true,
                    watchlists: {
                        select: {
                            movie: true,
                        }
                    }
                }
            }
        }
    })
    if(user.length > 0) {
        const result = user[0]
        return res.status(200).json(user[0])
    } else {
        return res.status(400).json({"error": "Usuario no encontrado"})
    }
}