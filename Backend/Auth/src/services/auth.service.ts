import bcrypt from "bcryptjs";
import { OkPacket } from "mysql2";
import { ConflictError, UnauthorizedError, ValidationError } from "@yd/restify";
import { createToken } from "@yd/jwt";
import { dal } from "../utils/dal";
import { UserModel, RegisterModel, LoginModel } from "../models/user.model";

class AuthService {

    async register(data: RegisterModel): Promise<string> {
        const { firstName, lastName, email, password } = data;

        // Validate:
        if (!firstName || !lastName || !email || !password) {
            throw new ValidationError("All fields are required.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError("Invalid email format.");
        }
        if (password.length < 4) {
            throw new ValidationError("Password must be at least 4 characters.");
        }

        // Check email uniqueness:
        const existing = await dal.execute(
            "SELECT id FROM users WHERE email = ?", [email]
        ) as UserModel[];
        if (existing.length > 0) {
            throw new ConflictError("Email is already registered.");
        }

        // Hash password:
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user:
        const result = await dal.execute(
            "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
            [firstName, lastName, email, hashedPassword]
        ) as OkPacket;

        // Generate token:
        const token = createToken({
            userId: result.insertId,
            role: "user",
            firstName,
            lastName,
        });

        return token;
    }

    async login(data: LoginModel): Promise<string> {
        const { email, password } = data;

        // Validate:
        if (!email || !password) {
            throw new ValidationError("Email and password are required.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError("Invalid email format.");
        }

        // Find user:
        const users = await dal.execute(
            "SELECT id, firstName, lastName, email, password, role FROM users WHERE email = ?",
            [email]
        ) as UserModel[];

        const user = users[0];
        if (!user) {
            throw new UnauthorizedError("Incorrect email or password.");
        }

        // Compare password:
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError("Incorrect email or password.");
        }

        // Generate token:
        const token = createToken({
            userId: user.id!,
            role: user.role || "user",
            firstName: user.firstName,
            lastName: user.lastName,
        });

        return token;
    }
}

export const authService = new AuthService();
