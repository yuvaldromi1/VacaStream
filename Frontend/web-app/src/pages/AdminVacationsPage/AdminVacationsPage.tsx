import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, setVacations, setLoading, deleteVacation } from "../../store";
import { vacationService } from "../../services/vacation.service";
import { notyf } from "../../utils/notyf";
import { Spinner } from "../../components/Spinner/Spinner";
import { appConfig } from "../../utils/app-config";
import type { VacationModel } from "../../models/vacation.model";
import "./AdminVacationsPage.css";

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

const ITEMS_PER_PAGE = 9;

function AdminVacationsPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const vacations = useAppSelector((state) => state.vacations.list);
    const loading = useAppSelector((state) => state.vacations.loading);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");

    // Fetch vacations on mount:
    useEffect(() => {
        async function fetchVacations() {
            try {
                dispatch(setLoading(true));
                const data = await vacationService.getAll();
                dispatch(setVacations(data));
            } catch {
                setError("Failed to load vacations.");
                notyf.error("Failed to load vacations.");
                dispatch(setLoading(false));
            }
        }

        if (vacations.length === 0) {
            fetchVacations();
        }
    }, [dispatch, vacations.length]);

    // Sort by start date:
    const sorted = [...vacations].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const pageVacations = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    async function handleDelete(vacation: VacationModel) {
        const confirmed = window.confirm(`Are you sure you want to delete "${vacation.destination}"?`);
        if (!confirmed) return;

        try {
            await vacationService.remove(vacation.id);
            dispatch(deleteVacation(vacation.id));
            notyf.success("Vacation deleted.");
        } catch {
            notyf.error("Failed to delete vacation.");
        }
    }

    if (loading) return <Spinner message="Loading vacations..." />;

    if (error) return <div className="AdminVacationsPage"><p className="no-results">{error}</p></div>;

    return (
        <div className="AdminVacationsPage">
            <div className="admin-header">
                <h2>Manage Vacations</h2>
                <button className="add-btn" onClick={() => navigate("/admin/vacations/add")}>
                    ➕ Add Vacation
                </button>
            </div>

            {pageVacations.length === 0 ? (
                <p className="no-results">No vacations found.</p>
            ) : (
                <div className="admin-grid">
                    {pageVacations.map((vacation) => (
                        <div key={vacation.id} className="AdminCard">
                            <div
                                className="admin-card-image"
                                style={{
                                    backgroundImage: `url(${appConfig.apiUrl}/api/vacations/images/${vacation.imageFileName})`,
                                }}
                            >
                                <h3 className="admin-destination">{vacation.destination}</h3>
                            </div>
                            <div className="admin-card-content">
                                <div className="admin-date-range">
                                    📅 {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
                                </div>
                                <p className="admin-description">{vacation.description}</p>
                                <div className="admin-price">${vacation.price}</div>
                                <div className="admin-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/admin/vacations/edit/${vacation.id}`)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(vacation)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button className="page-btn nav-btn" disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} className={`page-btn ${p === safePage ? "active" : ""}`} onClick={() => setCurrentPage(p)}>{p}</button>
                    ))}
                    <button className="page-btn nav-btn" disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)}>›</button>
                </div>
            )}
        </div>
    );
}

export default AdminVacationsPage;
