const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const protect = async (req, res, next) => {
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    createdAt: true,
                }
            });

            if(!user) return res.status(401).json({ message: 'User no longer exists' });
            req.user = user;
            next();
        } catch (err){
            console.error("Authentication Error:", err);
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;