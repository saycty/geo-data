import jwt from "jsonwebtoken";

/**
 * This middleware verifies the token in the Authorization header.
 * If the token is valid, it appends the user details to the request.
 * If the token is invalid, it sends a 401 status with an appropriate message.
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
