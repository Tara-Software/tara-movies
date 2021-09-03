import prisma from '../../lib/prisma';

// const prisma = new PrismaClient()

export default async function handle(req, res) {
    if(req.method == 'POST'){

    } else {
        const movies = await prisma.movie.findMany();
        res.json(movies);
    }
}