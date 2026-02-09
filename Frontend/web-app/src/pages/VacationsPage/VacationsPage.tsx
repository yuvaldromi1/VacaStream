import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector, setVacations, setLoading } from "../../store";
import { vacationService } from "../../services/vacation.service";
import { notyf } from "../../utils/notyf";
import { Spinner } from "../../components/Spinner/Spinner";
import VacationCard from "../../components/VacationCard/VacationCard";
import type { VacationModel } from "../../models/vacation.model";
import "./VacationsPage.css";

type FilterType = "all" | "liked" | "active" | "not-started";

const ITEMS_PER_PAGE = 9;

function VacationsPage() {
    const dispatch = useAppDispatch();
    const vacations = useAppSelector((state) => state.vacations.list);
    const loading = useAppSelector((state) => state.vacations.loading);
    const [filter, setFilter] = useState<FilterType>("all");
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

    // Apply filter:
    function applyFilter(list: VacationModel[]): VacationModel[] {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        switch (filter) {
            case "liked":
                return list.filter((vacation) => vacation.isLikedByUser);
            case "active":
                return list.filter((vacation) => {
                    const start = new Date(vacation.startDate);
                    const end = new Date(vacation.endDate);
                    return start <= now && end >= now;
                });
            case "not-started":
                return list.filter((vacation) => new Date(vacation.startDate) > now);
            default:
                return list;
        }
    }

    // Sort by start date ascending:
    function sortByDate(list: VacationModel[]): VacationModel[] {
        return [...list].sort(
            (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
    }

    const filtered = applyFilter(vacations);
    const sorted = sortByDate(filtered);
    const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));

    // Ensure currentPage is valid:
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const pageVacations = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Build page numbers array with ellipsis:
    function getPageNumbers(): (number | "...")[] {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (safePage > 3) pages.push("...");
            const start = Math.max(2, safePage - 1);
            const end = Math.min(totalPages - 1, safePage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (safePage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    }

    // Change filter and reset to page 1:
    function changeFilter(newFilter: FilterType) {
        setFilter(newFilter);
        setCurrentPage(1);
    }

    if (loading) return <Spinner message="Loading vacations..." />;

    if (error) return <div className="VacationsPage"><p className="no-results">{error}</p></div>;

    return (
        <div className="VacationsPage">
            {/* Filter bar */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => changeFilter("all")}
                >
                    ✈️ All
                </button>
                <button
                    className={`filter-btn ${filter === "liked" ? "active" : ""}`}
                    onClick={() => changeFilter("liked")}
                >
                    ❤️ Liked
                </button>
                <button
                    className={`filter-btn ${filter === "active" ? "active" : ""}`}
                    onClick={() => changeFilter("active")}
                >
                    🌴 Active Now
                </button>
                <button
                    className={`filter-btn ${filter === "not-started" ? "active" : ""}`}
                    onClick={() => changeFilter("not-started")}
                >
                    🔜 Not Started
                </button>
            </div>

            {/* Vacations grid */}
            {pageVacations.length === 0 ? (
                <p className="no-results">No vacations match this filter.</p>
            ) : (
                <div className="vacations-grid">
                    {pageVacations.map((vacation) => (
                        <VacationCard key={vacation.id} vacation={vacation} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn nav-btn"
                        disabled={safePage === 1}
                        onClick={() => setCurrentPage(safePage - 1)}
                    >
                        ‹
                    </button>

                    {getPageNumbers().map((p, idx) =>
                        p === "..." ? (
                            <span key={`dots-${idx}`} className="page-dots">…</span>
                        ) : (
                            <button
                                key={p}
                                className={`page-btn ${p === safePage ? "active" : ""}`}
                                onClick={() => setCurrentPage(p)}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        className="page-btn nav-btn"
                        disabled={safePage === totalPages}
                        onClick={() => setCurrentPage(safePage + 1)}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}

export default VacationsPage;
