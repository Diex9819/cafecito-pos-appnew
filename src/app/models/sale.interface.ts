import { Product } from "./product.interface";

// ========================
// Lo que ENVÍAS al backend
// ========================
export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface SaleItemRequest {
    product: string;         // productId como string
    quantity: number;
    unitPrice?: number;
    amount?: number;
}

export interface SaleRequest {
    customerId?: string;
    items: SaleItemRequest[];
    subtotal: number;
    total: number;
    paymentMethod: PaymentMethod;
}

// ========================
// Lo que RECIBES del backend
// ========================
export interface CustomerPopulated {
    _id: string;
    name: string;
    email: string;
}

export interface SaleItemDetail {
    productId: string;
    productNameSnapshot: string;
    unitPriceSnapshot: number;
    quantity: number;
    lineTotal: number;
}

export interface Sale {
    _id?: string;
    saleId?: string;
    customerId?: CustomerPopulated | null;
    paymentMethod: PaymentMethod;
    items: SaleItemDetail[];

    subtotal: number;
    discountPercent?: number;
    discountAmount?: number;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// ========================
// Carrito (frontend only)
// ========================
export interface CartItem {
    product: Product;
    quantity: number;
    amount: number;
}