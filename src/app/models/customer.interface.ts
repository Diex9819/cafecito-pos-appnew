
export interface Customer {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    purchasesCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}