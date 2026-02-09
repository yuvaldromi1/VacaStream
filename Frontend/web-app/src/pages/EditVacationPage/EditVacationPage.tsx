import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, updateVacation } from "../../store";
import { vacationService } from "../../services/vacation.service";
import { notyf } from "../../utils/notyf";
import { getErrorMessage } from "../../utils/error-helper";
import { Spinner } from "../../components/Spinner/Spinner";
import { appConfig } from "../../utils/app-config";
import "../AddVacationPage/AddVacationPage.css";
import "./EditVacationPage.css";

function EditVacationPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [destination, setDestination] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [price, setPrice] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchVacation() {
            try {
                const vacation = await vacationService.getById(Number(id));
                setDestination(vacation.destination);
                setDescription(vacation.description);
                setStartDate(vacation.startDate.split("T")[0]);
                setEndDate(vacation.endDate.split("T")[0]);
                setPrice(String(vacation.price));
                if (vacation.imageFileName) {
                    setCurrentImageUrl(`${appConfig.apiUrl}/api/vacations/images/${vacation.imageFileName}`);
                }
            } catch {
                setError("Failed to load vacation data.");
            } finally {
                setLoading(false);
            }
        }

        fetchVacation();
    }, [id]);

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
        if (!destination || !description || !startDate || !endDate || !price) {
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
            if (image) {
                formData.append("image", image);
            }

            const updated = await vacationService.update(Number(id), formData);
            dispatch(updateVacation(updated));
            notyf.success("Vacation updated!");
            navigate("/admin/vacations");
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to update vacation."));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Spinner message="Loading vacation..." />;

    return (
        <div className="EditVacationPage">
            <form onSubmit={handleSubmit} className="VacationForm">
                <h2>Edit Vacation</h2>

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
                        />
                    </label>
                    <label>
                        End Date
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
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

                {/* Current image */}
                {currentImageUrl && !preview && (
                    <div className="current-image-section">
                        <span className="current-image-label">Current image:</span>
                        <div className="current-image">
                            <img src={currentImageUrl} alt="Current vacation" />
                        </div>
                    </div>
                )}

                <label>
                    {currentImageUrl ? "Replace Image (optional)" : "Image"}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                    />
                </label>

                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="New preview" />
                    </div>
                )}

                <div className="form-buttons">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate("/admin/vacations")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditVacationPage;
