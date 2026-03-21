import { generateAccessToken } from "../services/jwt.service.js";
import prisma from "../server.js";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

export const register = async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { data } = result;

  try {
    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "Registration failed",
        errors: { email: ["This email is already taken"] },
      });
    }

    const hashed_password = await bcrypt.hash(data.password, 11);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: hashed_password,
      },
      omit: { password_hash: true, created_at: true },
    });

    const accessToken = generateAccessToken(newUser.id);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: newUser,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: { server: ["Something went wrong"] },
    });
  }
};

export const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { data } = result;

  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      omit: { created_at: true },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        errors: { credentials: ["Invalid email or password"] },
      });
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        errors: { credentials: ["Invalid email or password"] },
      });
    }

    const accessToken = generateAccessToken(user.id);

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: { server: ["Something went wrong"] },
    });
  }
};
