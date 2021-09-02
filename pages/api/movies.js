import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path';


const prisma = new PrismaClient();

export default async function handle(req, res) {
    if(req.method == 'POST'){

    } else {
        const movies = await prisma.movie.findMany();
        res.json(movies);
    }
}