import jsonwebtoken from "jsonwebtoken";

export interface JwtPayload {
    userId: number;
    role: "user" | "admin";
    firstName: string;
    lastName: string;
}

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }
    return secret;
}

export function createToken(payload: JwtPayload): string {
    const token = jsonwebtoken.sign(
        { ...payload } as Record<string, unknown>,
        getSecret(),
        { expiresIn: "4h" }
    );
    return token;
}

export function verifyToken(token: string): JwtPayload {
    const decoded = jsonwebtoken.verify(token, getSecret());
    return decoded as JwtPayload;
}
