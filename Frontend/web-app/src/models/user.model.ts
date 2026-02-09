export interface UserModel {
    userId: number;
    role: "user" | "admin";
    firstName: string;
    lastName: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}
