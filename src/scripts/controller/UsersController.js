import Users from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

export const Register = async (req, res) => {
  const { name, email, password, confpassword } = req.body;
  if (password !== confpassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak sama!" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword
    });
    res.status(201).json({ msg: "Register Berhasil!" });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export const Login = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "Email tidak ditemukan!" });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Password salah!" });
    }
    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = JWT.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = JWT.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });
    console.log("Set-Cookie header:", refreshToken);
    return res.json({
      accessToken,
      user: { name, email }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken
    }
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update({ refresh_token: null }, {
    where: {
      id: userId
    }
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
}