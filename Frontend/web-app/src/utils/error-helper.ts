import axios from "axios";

// Extract a user-friendly error message from an Axios error response:
export function getErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        return err.response?.data?.error || fallback;
    }
    return fallback;
}
