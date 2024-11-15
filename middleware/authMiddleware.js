const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // It Modifies the Request Object: After verifying the token,
        // authMiddleware attaches the decoded user data (from the token) to req.user. 
        // This makes the user information available to the subsequent route handler without 
        // needing to verify the token again. This is a common pattern for 
        // middleware: altering the req or res objects to share information across the application.
        req.user = decoded; 
        next();
    } catch(error) {
        return res.status(403).json({message: 'Invalid or expired token'});
    }
}

module.exports = authMiddleware;