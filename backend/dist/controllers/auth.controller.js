"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users = [
    {
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        passwordHash: bcrypt_1.default.hashSync("admin123", 10),
    },
];
const JWT_SECRET = process.env.JWT_SECRET || "crud-faizan-secret";
function createToken(user) {
    return jsonwebtoken_1.default.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
    }, JWT_SECRET, {
        expiresIn: "8h",
    });
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email dan password wajib diisi",
            });
        }
        const user = users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Email atau password salah",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(String(password), user.passwordHash);
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server",
        });
    }
};
exports.login = login;
const getProfile = (req, res) => {
    const user = req.user;
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
exports.getProfile = getProfile;
