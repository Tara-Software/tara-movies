import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    if(req.method == 'POST') {
        const { id } = JSON.parse(req.body)
        try {
            const deleteGenreOnMovie = await prisma.genreOnMovie.deleteMany({
                where: {
                    movieId: id
                }
            });
            const deleteWatchlists = await prisma.watchlist.deleteMany({
                where: {
                    movieId: id
                }
            });
            const deleteMovie = await prisma.movie.delete({
                where: {
                    id: id
                }
            });
            return res.status(200).json({})
        } catch (error) {
            console.log(error)
            return res.status(500).json({error: error})
        }
    }
}