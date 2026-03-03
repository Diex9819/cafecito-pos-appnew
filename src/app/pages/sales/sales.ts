import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ProductService } from '../../services/products/product.service';
import { CartService } from '../../services/cart/cart';
import { SaleService } from '../../services/sales/sale.service';
import { CustomerService } from '../../services/customers/customer.service';
import { Product } from '../../models/product.interface';
import { Customer } from '../../models/customer.interface';
import { SaleRequest, SaleItemRequest, PaymentMethod } from '../../models/sale.interface';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [Navbar, CurrencyPipe, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css'
})
export class Sales implements OnInit {
  private productService = inject(ProductService);
  public cartService = inject(CartService);
  private saleService = inject(SaleService);
  private customerService = inject(CustomerService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  processing: boolean = false;
  

  // --- Checkout ---
  showCheckout: boolean = false;
  customerSearch: string = '';
  allCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  showCustomerResults: boolean = false;
  discountPercent: number = 0;
  selectedPaymentMethod: PaymentMethod = 'cash';
  showTicketModal: boolean = false;
  lastSale: any = null;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase().trim();

    if (term === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name?.toLocaleLowerCase().includes(term) ||
        product.description?.toLocaleLowerCase().includes(term) ||
        product.category?.toLocaleLowerCase().includes(term)
      );
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  // =====================
  // CHECKOUT FLOW
  // =====================

  openCheckout() {
    if (this.cartService.cartItems().length === 0) return;
    this.showCheckout = true;
    this.loadCustomers();
  }

  closeCheckout() {
    this.showCheckout = false;
    this.resetCheckout();
  }

  private resetCheckout() {
    this.customerSearch = '';
    this.filteredCustomers = [];
    this.selectedCustomer = null;
    this.showCustomerResults = false;
    this.discountPercent = 0;
    this.selectedPaymentMethod = 'cash';
  }

  // --- Customer search ---
  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.allCustomers = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  onCustomerSearchChange() {
    const term = this.customerSearch.toLowerCase().trim();

    if (term.length < 1) {
      this.filteredCustomers = [];
      this.showCustomerResults = false;
      return;
    }

    this.filteredCustomers = this.allCustomers.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
    this.showCustomerResults = this.filteredCustomers.length > 0;
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.customerSearch = '';
    this.showCustomerResults = false;
    this.discountPercent = this.calculateDiscount(customer.purchasesCount);
  }

  removeCustomer() {
    this.selectedCustomer = null;
    this.discountPercent = 0;
  }

  // --- Discount (mirrors backend discountService.js) ---
  calculateDiscount(purchasesCount: number): number {
    if (purchasesCount >= 8) return 15;  // Gold
    if (purchasesCount >= 4) return 10;  // Silver
    if (purchasesCount >= 1) return 5;   // Basic
    return 0;
  }

  getDiscountLabel(): string {
    if (this.discountPercent >= 15) return '🥇 Gold';
    if (this.discountPercent >= 10) return '🥈 Silver';
    if (this.discountPercent >= 5) return '🥉 Basic';
    return '';
  }

  get discountAmount(): number {
    return (this.cartService.subtotal() * this.discountPercent) / 100;
  }

  get finalTotal(): number {
    return this.cartService.subtotal() - this.discountAmount;
  }

  // --- Confirm sale ---
  confirmSale() {
    if (this.cartService.cartItems().length === 0) return;

    this.processing = true;

    const saleItems: SaleItemRequest[] = this.cartService.cartItems().map(item => ({
      product: item.product._id!,
      quantity: item.quantity,
      unitPrice: item.product.price,
      amount: item.amount
    }));

    const saleData: SaleRequest = {
      customerId: this.selectedCustomer?._id,
      items: saleItems,
      subtotal: this.cartService.subtotal(),
      total: this.finalTotal,
      paymentMethod: this.selectedPaymentMethod
    };

    this.saleService.createSale(saleData).subscribe({
      next: (response) => {
        console.log('Venta procesada:', response);
        this.lastSale = response.sale;
        this.showTicketModal = true;

        this.cartService.clearCart();
        this.showCheckout = false;
        this.resetCheckout();
        
        this.processing = false;
      },
      error: (err) => {
        console.error('Error al procesar venta:', err);
        alert('Error al procesar la venta. Inténtalo de nuevo.');
        this.processing = false;
      }
    });
  }

  processSale() {
    this.openCheckout();
  }
}