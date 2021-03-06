
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();

export async function getServerSideProps() {
    const movies = await prisma.movie.findMany();
    const res = movies.json()
    return {
        props: {
            initialMovies: movies
        }
    };
}

export function getSortedMoviesData() {
    // Get file names under /movies
    const fileNames = fs.readdirSync(moviesDirectory)
    const allMoviesData = fileNames.map(fileName => {

        // remove extension from filename to get id
        
        const [id, extension] = fileName.split('.')
        // TODO: Read file Contents as the movie and so and so
        // TODO: Implement a database with info

        return {id, extension}
    })
    // sort movies by name
    return allMoviesData.sort((a, b) => {
        if(a.id < b.id) {
            return 1
        }
        else {
            return -1
        }
    })
}
export async function getAllMovieIds() {
    const movies = await prisma.movie.findMany()
    
    const paths = await movies.map(({ title, id }) => {
        const title_sanitized = title.replaceAll(" ", "-").toLowerCase();
        return {
            params: {
                id: title_sanitized
            }
        }
    })
    return paths
}
export async function getAllDirectors() {
    return await prisma.director.findMany()
}
export async function getAllGenres() {
    return await prisma.genre.findMany()
}
export async function getAllMovies() {
    return await prisma.movie.findMany({
        select: {
            id: true,
            title: true,
            thumbnail: true,
            description: true,
            directorId: true,
            genres: true
        }
    });
}
export async function getMovieData(id) {
    const res = await prisma.movie.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            title: true,
            description: true,
            location: true,
            thumbnail: true,
            director: true,
            genres: true
        }
    });

    var genres = await Promise.all(res.genres.map(async (genre) => (
        await prisma.genre.findUnique({
            where: {
                id: genre.genreId
            }
        })
    )))
    return {
        id,
        ...res,
        genres
    }
}
