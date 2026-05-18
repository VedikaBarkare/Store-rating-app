import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {

  try {

    // GET TOKEN FROM HEADERS
    const token = req.headers.authorization;

    // CHECK TOKEN EXISTS
    if (!token) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    // REMOVE "Bearer "
    const actualToken = token.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET
    );

    // SAVE USER DATA IN REQUEST
    req.user = decoded;

    // MOVE TO NEXT FUNCTION
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }

};