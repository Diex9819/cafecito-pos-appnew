export interface User {
    _id?: string;
    name: string;
    email: string;
    role: 'admin' | 'cajero';
    createdAt?: Date;
    updatedAt?: Date;
}