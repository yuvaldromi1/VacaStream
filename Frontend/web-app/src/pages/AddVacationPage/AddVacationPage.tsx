import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, addVacation } from "../../store";
import { vacationService } from "../../services/vacation.service";
import { notyf } from "../../utils/notyf";
import { getErrorMessage } from "../../utils/error-helper";
import "./AddVacationPage.css";

function AddVacationPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [destination, setDestination] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview("");
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        // Validation:
        if (!destination || !description || !startDate || !endDate || !price || !image) {
            setError("All fields are required.");
            return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
            setError("End date must be after start date.");
            return;
        }
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice < 0 || numericPrice > 10000) {
            setError("Price must be between 0 and 10,000.");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("destination", destination.trim());
            formData.append("description", description.trim());
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("price", numericPrice.toString());
            formData.append("image", image);

            const newVacation = await vacationService.create(formData);
            dispatch(addVacation(newVacation));
            notyf.success("Vacation added!");
            navigate("/admin/vacations");
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to add vacation."));
        } finally {
            setSubmitting(false);
        }
    }

    // Minimum date for start = today:
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="AddVacationPage">
            <form onSubmit={handleSubmit} className="VacationForm">
                <h2>Add Vacation</h2>

                {error && <div className="ErrorMessage">{error}</div>}

                <label>
                    Destination
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Paris, France"
                        maxLength={100}
                        autoFocus
                    />
                </label>

                <label>
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe this vacation..."
                        rows={4}
                        maxLength={1000}
                    />
                </label>

                <div className="date-row">
                    <label>
                        Start Date
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={today}
                        />
                    </label>
                    <label>
                        End Date
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || today}
                        />
                    </label>
                </div>

                <label>
                    Price ($)
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0 - 10,000"
                        min={0}
                        max={10000}
                        step={1}
                    />
                </label>

                <label>
                    Image
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                    />
                </label>

                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="Preview" />
                    </div>
                )}

                <div className="form-buttons">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Adding..." : "Add Vacation"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate("/admin/vacations")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddVacationPage;
