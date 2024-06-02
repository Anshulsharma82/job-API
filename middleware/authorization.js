const { UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')
const auth = async (req,res,next) => {
    const { authorization } = req.headers
    if(!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthenticatedError('You are not authorized for this route')
    }
    try {
        const token = authorization.split(' ')[1]
        const decodeJWT = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: decodeJWT.userId , name: decodeJWT.name}
        next()    
    } catch (error) {
        throw new UnauthenticatedError('Invalid JWT')  
    }
    
}

module.exports = auth