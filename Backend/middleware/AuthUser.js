import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Received token:", token); // <-- debug log

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // <-- debug log

    // Depending on how token was signed, try lowercase id or Id
    req.user = { id: decoded.Id || decoded.id };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
