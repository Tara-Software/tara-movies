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

    if (req.method === 'POST') {
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
            request.post({
                url: "http://localhost:3002/upload",
                formData: formData,
            });
        });

        form.on('error', function(err) {
            console.log(error)
        });
        form.on('close', function() {
            res.send("received upload")
        });

        form.parse(req)
    }
} 

// })
// export default handler