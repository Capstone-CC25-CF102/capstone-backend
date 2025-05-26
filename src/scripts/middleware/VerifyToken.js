import JWT from 'jsonwebtoken';

export const VerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No access token provided" });
  }

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ error: "Invalid or expired access token" });
    }
    req.user = decoded.email;
    next();
  });
};