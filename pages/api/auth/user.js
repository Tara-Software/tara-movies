import prisma from '../../../lib/prisma';

// const prisma = new PrismaClient()
export default async function handle(req, res) {
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
                    name: true,
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
        return res.status(200).json(user[0])
    } else {
        return res.status(400).json({"error": "Usuario no encontrado"})
    }
}