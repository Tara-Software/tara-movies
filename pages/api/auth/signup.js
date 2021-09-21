import prisma from '../../../lib/prisma';
// const prisma = new PrismaClient()

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return email != undefined && re.test(email);
}
function validateUsername(username) {
    var re = /^[a-zA-z]+$/; 
    return username != undefined && re.test(username) && username.length <= 15
}
export default async function handle(req, res) {
    const user = JSON.parse(req.body);
    if(!validateEmail(user.email)) {
        return res.status(401).json({error: "Email incorrecto."});
    }
    if(!validateUsername(user.name)) {
        return res.status(401).json({error: "El usuario solo puede ser un máximo de 15 letras sin espacios."});
    }
    // Check if email exists
    const email_exists = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    });
    if(email_exists) {
        return res.status(401).json({error: "El correo electrónico ya existe en la base de datos."})
    }
    const username_exists = await prisma.user.findUnique({
        where: {
            name: user.name
        }
    });
    if(username_exists) {
        return res.status(401).json({error: "Este usuario ya está cogido :("})
    }
    
    // Primera vez que se mete el usuario letsgo
    try {
        const result = await prisma.user.create({
            data : {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        });
        
        // Código para generar una imagen 
        var id = result.id
        console.log("eiei")
        const response = await fetch(`/upavatar`, {
            method: 'POST',
            body: JSON.stringify({id:id}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
       
        await prisma.user.update({
            where: {
                id: id
            },
            data: {
                avatar: `/avatar/${id}`
            }
        });
        
        return res.status(200).json(result)
    } catch(error) {
        console.error(error)
        return res.status(500).json({error: "Se ha producido un error en los servidores. Inténtalo de nuevo más tarde."})
    }
    return res
}