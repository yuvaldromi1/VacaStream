import { Notyf } from "notyf";
import "notyf/notyf.min.css";

// Single Notyf instance for the entire app:
export const notyf = new Notyf({
    duration: 3000,
    position: { x: "center", y: "top" },
    dismissible: true,
});
