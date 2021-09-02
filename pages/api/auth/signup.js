import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handle(req, res) {
    const user = JSON.parse(req.body)

    // Check if email exists
    const exists = await prisma.user.findUnique({
        where: {
            email: user["email"]
        }
    })
    // Primera vez que se mete el usuario letsgo
    if(exists === null){
        const result = await prisma.user.create({
            data : {
                name: user.name,
                email: user.email,
                password: user.password,
                avatar: "/images/avatar/default.png"
            }
        })
        // aqui deberiamos crear una nueva sesión para nuestro señor y tal! 
        return res.json(result)
    }
    return res
}