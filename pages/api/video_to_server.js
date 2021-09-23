import cors, { runMiddleWare } from "../../lib/middleware"

var path = require("path")
var os = require("os")
var fs = require("fs")
var multiparty = require("multiparty")
var request = require("request")

export const config = {
    api: {
        bodyParser: false
    }
}
// Cors me quita el parseito
// const handler = nc().use(cors()).post(async (req, res) => {

export default async function handle(req, res) {
    await runMiddleWare(req, res, cors);

    if (req.method === 'POST') {
        console.log("conseguimos llegar a video to server :)")
        var form = new multiparty.Form()

        form.on('part', function(formPart) {
            var contentType = formPart.headers['content-type'];

            var formData = {
                file: {
                    value: formPart,
                    options: {
                        filename: formPart.filename,
                        contentType: contentType,
                        knownLength: formPart.byteCount
                    }
                }
            };
            console.log("Estoy pidiendo que suba mi video")
            request.post({
                url: `${process.env.NEXT_PUBLIC_VIDEOS_URL}/upload`,
                formData: formData,
            });
        });

        form.on('error', function(err) {
            console.log(error)
            console.log("Soy yo!")
            res.status(500).json("Todo mal")
        });
        form.on('close', function() {
            res.status(200).send("received upload")
        });

        form.parse(req)
    } else {
        res.status(500).json({error: "algo mal"})
    }
    return res
} 

// })
// export default handler