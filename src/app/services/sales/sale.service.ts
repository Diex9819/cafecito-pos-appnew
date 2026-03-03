import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SaleRequest } from '../../models/sale.interface';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = 'https://cafecito-pos-api.onrender.com/api/sales';

  constructor(private http: HttpClient) {}

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  createSale(saleData: SaleRequest): Observable<{ message: string; sale: Sale }> {
    return this.http.post<{ message: string; sale: Sale }>(this.apiUrl, saleData);
  }
}