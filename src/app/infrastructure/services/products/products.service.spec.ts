import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../../models/products/products.model';
import { ProductService } from './products.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      category: 'Electronics',
      price: 1000,
      stockQuantity: 50
    },
    {
      id: 2,
      name: 'Smartphone',
      category: 'Electronics',
      price: 500,
      stockQuantity: 100
    }
  ];

  const mockProduct: Product = {
    name: 'Tablet',
    category: 'Electronics',
    price: 300,
    stockQuantity: 75
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should retrieve all products', async () => {
      const result = service.getProducts();

      const req = httpMock.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);

      const products = await result;
      expect(products).toEqual(mockProducts);
    });
  });

  describe('getProduct', () => {
    it('should retrieve a single product by id', (done) => {
      const testProduct = mockProducts[0];

      service.getProduct(1).subscribe(product => {
        expect(product).toEqual(testProduct);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/products/1');
      expect(req.request.method).toBe('GET');
      req.flush(testProduct);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createdProduct = { ...mockProduct, id: 3 };

      const result = service.createProduct(mockProduct);

      const req = httpMock.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(createdProduct);

      const response = await result;
      expect(response).toEqual(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updatedProduct = {
        ...mockProducts[0],
        price: 1200
      };

      const result = service.updateProduct(1, updatedProduct);

      const req = httpMock.expectOne('http://localhost:8080/api/products/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(updatedProduct);

      const response = await result;
      expect(response).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const result = service.deleteProduct(1);

      const req = httpMock.expectOne('http://localhost:8080/api/products/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      const response = await result;
      expect(response).toBeNull();
    });
  });
});
