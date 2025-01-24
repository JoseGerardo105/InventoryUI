import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Product } from '../../models/products/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  getProducts() {
    return firstValueFrom(
      this.http.get<any>(
        `${this.apiUrl}`,
      ),
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product) {
    return firstValueFrom(
      this.http.post<any>(
        `${this.apiUrl}`, product,
      ),
    );
  }

  updateProduct(id: number, product: Product) {
    return firstValueFrom(
      this.http.put<Product>(
        `${this.apiUrl}/${id}`, product,
      ),
    );
  }

  deleteProduct(id: number,) {
    return firstValueFrom(
      this.http.delete<Product>(
        `${this.apiUrl}/${id}`,
      ),
    );
  }

}
