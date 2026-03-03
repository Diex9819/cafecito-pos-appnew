 export type Category =
 'Bebidas calientes'|'Frappucino'|'Bebidas frias'|'Bebidas Base Té'|'Cold Brew'|'Alimentos'|'Cafe en grano';

 export interface Product {
    _id?: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    category: Category;
    images: string[];
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
 }