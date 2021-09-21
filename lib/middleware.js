import Cors from 'cors';

const cors = Cors({
    methods: ['GET', 'POST', 'PUT']
});

export function runMiddleWare(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if( result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        })
    })
}

export default cors;