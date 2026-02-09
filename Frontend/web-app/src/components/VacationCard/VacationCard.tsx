import { useState } from "react";
import { useAppDispatch, toggleLike } from "../../store";
import { vacationService } from "../../services/vacation.service";
import { appConfig } from "../../utils/app-config";
import type { VacationModel } from "../../models/vacation.model";
import "./VacationCard.css";

interface VacationCardProps {
    vacation: VacationModel;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function VacationCard({ vacation }: VacationCardProps) {
    const dispatch = useAppDispatch();
    const [imgError, setImgError] = useState(false);

    const imageUrl = imgError
        ? ""
        : `${appConfig.apiUrl}/api/vacations/images/${vacation.imageFileName}`;

    async function handleLikeToggle() {
        const wasLiked = vacation.isLikedByUser;

        // Optimistic update:
        dispatch(toggleLike({ vacationId: vacation.id, isLiked: !wasLiked }));

        try {
            if (wasLiked) {
                await vacationService.unlike(vacation.id);
            } else {
                await vacationService.like(vacation.id);
            }
        } catch {
            // Rollback on error:
            dispatch(toggleLike({ vacationId: vacation.id, isLiked: wasLiked }));
        }
    }

    return (
        <div className="VacationCard">
            {/* Like button */}
            <button
                className={`like-btn ${vacation.isLikedByUser ? "liked" : ""}`}
                onClick={handleLikeToggle}
                title={vacation.isLikedByUser ? "Unlike" : "Like"}
            >
                <span className="heart-icon">{vacation.isLikedByUser ? "❤️" : "🤍"}</span>
                <span className="like-count">Like {vacation.likesCount}</span>
            </button>

            {/* Image section */}
            <div
                className={`card-image ${imgError ? "no-image" : ""}`}
                style={!imgError ? { backgroundImage: `url(${imageUrl})` } : undefined}
            >
                {!imgError && (
                    <img
                        src={imageUrl}
                        alt=""
                        className="image-preloader"
                        onError={() => setImgError(true)}
                    />
                )}
                <h3 className="destination-name">{vacation.destination}</h3>
            </div>

            {/* Content section */}
            <div className="card-content">
                <div className="date-range">
                    <span className="calendar-icon">📅</span>
                    <span>{formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}</span>
                </div>

                <p className="description">{vacation.description}</p>

                <div className="price-tag">
                    ${vacation.price}
                </div>
            </div>
        </div>
    );
}

export default VacationCard;
