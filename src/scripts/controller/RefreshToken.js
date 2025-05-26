import Users from "../models/UserModel.js";
import JWT from 'jsonwebtoken';

export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Received refresh token:", refreshToken); // Debugging
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Refresh token is invalid or expired" });
      }
      const userId = user.id;
      const name = user.name;
      const email = user.email;
      const accessToken = JWT.sign(
        { userId, name, email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      return res.json({ accessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};