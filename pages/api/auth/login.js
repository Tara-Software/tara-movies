import { PrismaClient } from '@prisma/client'
import { SHA256 } from 'crypto-js'
import nookies from 'nookies'
import prisma from '../../../lib/prisma';

// const prisma = new PrismaClient()

export default async function handle(req, res) {

    const {email, password} = JSON.parse(req.body)
    const exists = await prisma.user.findUnique({
        where: {
            email: email        }
    })
    if(exists) {
        // Devolver el usuario y un token de sesion??
        if(exists.password != password)  {
            throw new Error("Usuario o contraseña incorrectos")
        }

        // Create new session inside login
        const expirationDate = new Date()
        expirationDate.setTime(expirationDate.getTime() + 86400000)
        const accessToken = SHA256(new Date().getTime().toString()).toString();
        const sessionToken = SHA256(email+new Date().getTime().toString()).toString()
        
        const session = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                sessions: {
                    create: {
                        sessionToken: sessionToken,
                        accessToken: accessToken,
                        expires: expirationDate,
                        has_expired: "false"
                    }
                }
            }
        })
        // token de autenticidad 100% verídico
        if(session) {

            const authToken = {
                username: session.name,
                email: email,  
                accessToken: accessToken,
                expires: expirationDate
            }
            nookies.set({ res }, 'accessToken', accessToken, { maxAge: 72576000, httpOnly: true, path: '/' })
            return res.status(200).json({})
        } else {
            return res.status(400).json({ "error" : "usuario o contraseña incorrectos"})
        }
    }
    throw new Error("Usuario o contraseña incorrectos")
}