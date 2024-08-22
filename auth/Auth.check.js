import jwt from 'jsonwebtoken';

function checkToken(req, res, next) {
    try {
        const headersToken = req.headers.authorization;
        if (!headersToken || !headersToken.startsWith('Bearer ')) {
            return res.status(403).json({
                "message": "token not existed!!"
            })
        }
        const token = headersToken.split(" ")[1];
        const validToken = jwt.verify(token, process.env.SECRECT_KEY);
        req.username = validToken.username
        next()
    } catch (error) {
        console.log(error)
        res.json({
            "message": "something went wrong!!"
        })

    }
}

export default checkToken;
