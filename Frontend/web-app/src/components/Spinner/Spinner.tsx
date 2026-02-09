import "./Spinner.css";

interface SpinnerProps {
    message?: string;
}

export function Spinner({ message = "Loading..." }: SpinnerProps) {
    return (
        <div className="Spinner">
            <div className="spinner-overlay">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}
