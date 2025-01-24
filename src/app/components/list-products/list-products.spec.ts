import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../infrastructure/services/products/products.service';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog';
import { Product } from '../../infrastructure/models/products/products.model';
import Swal from 'sweetalert2';
import { ListProductsComponent } from './list-products';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Test Product 1',
    category: 'Test Category',
    price: 100,
    stockQuantity: 50,
  },
];

const NEW_PRODUCT: Product = {
  name: 'New Product',
  category: 'New Category',
  price: 200,
  stockQuantity: 100,
};

function setupComponent(): { component: ListProductsComponent; fixture: ComponentFixture<ListProductsComponent>; mocks: any } {
  const mockProductService = jasmine.createSpyObj('ProductService', ['getProducts', 'createProduct', 'updateProduct', 'deleteProduct']);
  const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
  const mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

  mockProductService.getProducts.and.resolveTo({ result: MOCK_PRODUCTS });

  TestBed.configureTestingModule({
    imports: [ListProductsComponent],
    providers: [
      { provide: ProductService, useValue: mockProductService },
      { provide: MatDialog, useValue: mockDialog },
      { provide: MatSnackBar, useValue: mockSnackBar },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ListProductsComponent);
  const component = fixture.componentInstance;

  return { component, fixture, mocks: { mockProductService, mockDialog, mockSnackBar } };
}
describe('ListProductsComponent', () => {
  let component: ListProductsComponent;
  let fixture: ComponentFixture<ListProductsComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const setup = setupComponent();
    component = setup.component;
    fixture = setup.fixture;
    mockProductService = setup.mocks.mockProductService;
    mockDialog = setup.mocks.mockDialog;
    mockSnackBar = setup.mocks.mockSnackBar;
  });

  describe('Initialization', () => {
    it('should load products on init', async () => {
      await component.ngOnInit();
      expect(mockProductService.getProducts).toHaveBeenCalled();
      expect(component.dataSource).toEqual(jasmine.arrayContaining(MOCK_PRODUCTS));
    });
  });

  describe('Dialog Interactions', () => {
    it('should open dialog for new product', () => {
      const mockDialogRef = { afterClosed: () => ({ subscribe: (fn: Function) => fn(null) }) };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      component.openFormDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(ProductFormDialogComponent, {
        width: '800px',
        data: {},
      });
    });

    it('should handle dialog closed with no data', () => {
      const mockDialogRef = { afterClosed: () => ({ subscribe: (fn: Function) => fn(null) }) };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      component.openFormDialog();

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should handle dialog result with a product for update', () => {
      spyOn(component, 'onUpdateProduct');
      const mockDialogRef = { afterClosed: () => ({ subscribe: (fn: Function) => fn(MOCK_PRODUCTS[0]) }) };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      component.openFormDialog(MOCK_PRODUCTS[0]);

      expect(component.onUpdateProduct).toHaveBeenCalledWith(MOCK_PRODUCTS[0]);
    });
  });

  describe('Product Creation', () => {
    it('should not create product when cancelled', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false }) as any);

      await component.confirmCreateProduct(NEW_PRODUCT);

      expect(mockProductService.createProduct).not.toHaveBeenCalled();
    });

    // it('should display success message when product is created', async () => {
    //   spyOn(Swal, 'fire');
    //   mockProductService.createProduct.and.resolveTo();

    //   await component.createProduct(NEW_PRODUCT);

    //   expect(Swal.fire).toHaveBeenCalledWith(
    //     jasmine.objectContaining({
    //       title: 'Creación producto',
    //       text: 'Producto creado correctamente.',
    //       icon: 'success',
    //     })
    //   );
    // });

    it('should display success message when product is created', async () => {
      spyOn(Swal, 'fire');
      mockProductService.createProduct.and.resolveTo();
      spyOn(component, 'getProducts');

      await component.createProduct(NEW_PRODUCT);

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Creación producto',
          text: 'Producto creado correctamente.',
          icon: 'success',
        })
      );
      expect(component.getProducts).toHaveBeenCalled();
    });

  });

  describe('Product Update', () => {
    it('should not proceed with update when cancelled', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false }) as any);

      await component.onUpdateProduct(MOCK_PRODUCTS[0]);

      expect(mockProductService.updateProduct).not.toHaveBeenCalled();
    });

    it('should show error if update fails', async () => {
      const productToUpdate: Product = {
        id: 1,
        name: 'Updated Product',
        category: 'Updated Category',
        price: 200,
        stockQuantity: 75,
      };

      mockProductService.updateProduct.and.rejectWith(new Error('Update failed'));
      spyOn(console, 'log');

      await component.updateProduct(productToUpdate);

      expect(console.log).toHaveBeenCalledWith(new Error('Update failed'));
    });

    it('should call updateProduct and show success message on confirmation', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);
      spyOn(component, 'updateProduct');

      await component.onUpdateProduct(MOCK_PRODUCTS[0]);

      expect(component.updateProduct).toHaveBeenCalledWith(MOCK_PRODUCTS[0]);
    });
  });

  describe('Product Deletion', () => {
    it('should not delete product when cancelled', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false }) as any);

      await component.onDeleteProduct(1);

      expect(mockProductService.deleteProduct).not.toHaveBeenCalled();
    });

    it('should delete product when confirmed', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);
      mockProductService.deleteProduct.and.resolveTo();
      spyOn(component, 'getProducts');

      await component.onDeleteProduct(1);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
      expect(component.getProducts).toHaveBeenCalled();
    });

    it('should handle error during deletion', async () => {
      mockProductService.deleteProduct.and.rejectWith(new Error('Deletion failed'));
      spyOn(console, 'log');

      await component.deleteProduct(1);

      expect(console.log).toHaveBeenCalledWith(new Error('Deletion failed'));
    });

    it('should call deleteProduct and refresh product list on confirmation', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);
      spyOn(component, 'getProducts');
      mockProductService.deleteProduct.and.resolveTo();

      await component.onDeleteProduct(1);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
      expect(component.getProducts).toHaveBeenCalled();
    });

    // it('should call snack bar after successful deletion', async () => {
    //   mockProductService.deleteProduct.and.resolveTo();
    //   spyOn(mockSnackBar, 'open');

    //   await component.deleteProduct(1);

    //   expect(mockSnackBar.open).toHaveBeenCalledWith(
    //     'Producto agregado exitosamente',
    //     'Cerrar',
    //     { duration: 3000 }
    //   );
    // });
  });

  describe('getProducts', () => {
    it('should handle empty product list', async () => {
      mockProductService.getProducts.and.resolveTo({ result: [] });

      await component.getProducts();

      expect(component.dataSource).toEqual([]);
    });

    it('should handle error during product retrieval', async () => {
      const errorMessage = 'Error retrieving products';
      mockProductService.getProducts.and.rejectWith(new Error(errorMessage));
      spyOn(console, 'log');

      await component.getProducts();

      expect(console.log).toHaveBeenCalledWith(new Error(errorMessage));
    });
  });
});
