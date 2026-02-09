export interface VacationModel {
    id?: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageFileName: string;
}

export interface VacationWithLikes extends VacationModel {
    likesCount: number;
    isLikedByUser: boolean;
}
