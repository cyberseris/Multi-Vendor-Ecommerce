const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {    
    // 優先從 header 取 token，如果沒有再從 cookie 取
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : req.cookies.accessToken;

    if(!token){
        return res.status(409).json({error: 'Please Login First'})
    }else{
        try{
            const deCodeToken = await jwt.verify(token, process.env.JWT_SECRET);
            req.role = deCodeToken.role
            req.id = deCodeToken.id
            next();
        } catch(err){
            console.log('Token verification failed:', err.message);
            return res.status(409).json({error: 'Please Login'})
        }
    }
}