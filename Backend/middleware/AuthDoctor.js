import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    const authdoctorHeader = req.headers.authorization;

    if (!authdoctorHeader || !authdoctorHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const dtoken = authdoctorHeader.split(" ")[1];
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    // attach doctor ID safely
    req.docId = token_decode.id;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authDoctor;
