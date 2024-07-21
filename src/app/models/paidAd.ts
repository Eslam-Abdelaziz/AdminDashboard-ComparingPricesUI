export interface PaidAd {
    id: number;
    contact: string;
    cost: number;
    productName: string;
    productImage: string;
    productPrice: number;
    productLink: string;
    startDate: string; // Representing DateOnly as a string
    endDate: string;   // Representing DateOnly as a string
    days: number;
}
