import jwt from 'jsonwebtoken';

const AuthAdmin = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized. Please login again!',
      });
    }

    const atoken = authHeader.split(' ')[1]; // Extract token

    // Verify token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // Custom check: ensure token contains expected payload
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid token.',
      });
    }

    next(); // Token is valid, continue
  } catch (error) {
    console.error('AuthAdmin Error:', error.message);
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export default AuthAdmin;
