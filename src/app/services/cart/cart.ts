import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CartItem } from '../../models/sale.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  // 1. ESTADO: Usamos una Signal para la lista de items
  // Es como una variable que avisa automáticamente cuando cambia
  cartItems = signal<CartItem[]>([]);

  // 2. COMPUTADOS: Se recalculan solos cuando cartItems cambia
  // Subtotal (Suma de todos los amounts)
  subtotal = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.amount, 0)
  );

  // Total (Podríamos agregar impuestos aquí si quisieras)
  total = computed(() => this.subtotal()); 
  
  // Conteo de artículos (para el badge del carrito)
  itemCount = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  // 3. MÉTODOS (ACCIONES)

  addToCart(product: Product) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product._id === product._id);

    if (existingItem) {
      // Si ya existe, aumentamos cantidad
      this.updateQuantity(existingItem.product._id!, existingItem.quantity + 1);
    } else {
      // Si es nuevo, lo agregamos
      this.cartItems.update(items => [
        ...items, 
        { 
          product, 
          quantity: 1, 
          amount: product.price 
        }
      ]);
    }
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(item => item.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update(items => 
      items.map(item => {
        if (item.product._id === productId) {
          return { 
            ...item, 
            quantity, 
            amount: quantity * item.product.price 
          };
        }
        return item;
      })
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}