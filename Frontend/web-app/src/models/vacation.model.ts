export interface VacationModel {
    id: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageFileName: string;
    likesCount: number;
    isLikedByUser: boolean;
}
