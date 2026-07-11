import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
  },
];

const JWT_SECRET = process.env.JWT_SECRET || "crud-faizan-secret";

function createToken(user: { id: number; email: string; name: string }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email dan password wajib diisi",
      });
    }

    const user = users.find(
      (item) => item.email.toLowerCase() === String(email).toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password salah",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password salah",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token: createToken(user),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server",
    });
  }
};

export const getProfile = (req: Request, res: Response) => {
  const user = (req as Request & { user?: any }).user;

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Token tidak valid",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
