export interface UserModel {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "user" | "admin";
}

export interface RegisterModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginModel {
    email: string;
    password: string;
}
