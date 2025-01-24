import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Product } from '../../infrastructure/models/products/products.model';
import { ProductFormDialogComponent } from './product-form-dialog';

describe('ProductFormDialogComponent', () => {
  let component: ProductFormDialogComponent;
  let fixture: ComponentFixture<ProductFormDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ProductFormDialogComponent>>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    category: 'Test Category',
    price: 100,
    stockQuantity: 50
  };

  const createComponent = (inputData: Product | null = null): ComponentFixture<ProductFormDialogComponent> => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        ProductFormDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: inputData }
      ]
    }).compileComponents();

    const componentFixture = TestBed.createComponent(ProductFormDialogComponent);
    componentFixture.detectChanges();
    return componentFixture;
  };

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']) as jasmine.SpyObj<MatDialogRef<ProductFormDialogComponent>>;
    fixture = createComponent();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form', () => {
      expect(component.productForm.valid).toBeFalsy();
      expect(component.isEditing).toBeFalse();
    });

    it('should set form values when editing existing product', () => {
      const editFixture = createComponent(mockProduct);
      const editComponent = editFixture.componentInstance;

      expect(editComponent.isEditing).toBeTrue();
      expect(editComponent.productForm.value).toEqual({
        name: mockProduct.name,
        category: mockProduct.category,
        price: mockProduct.price,
        stockQuantity: mockProduct.stockQuantity
      });
    });
  });

  describe('Form Validation', () => {
    const testInvalidScenarios: Array<Partial<Product>> = [
      { name: '' },
      { category: '' },
      { price: -1 },
      { stockQuantity: -5 }
    ];

    testInvalidScenarios.forEach(scenario => {
      it(`should be invalid with ${JSON.stringify(scenario)}`, () => {
        const validProduct: Product = {
          name: 'Valid Product',
          category: 'Valid Category',
          price: 100,
          stockQuantity: 50
        };

        const form: FormGroup = component.productForm;
        form.patchValue({ ...validProduct, ...scenario });

        expect(form.valid).toBeFalsy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should not close dialog with invalid form', () => {
      component.onSubmit();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should close dialog with product data when form is valid', () => {
      const validProduct: Omit<Product, 'id'> = {
        name: 'New Product',
        category: 'Electronics',
        price: 100,
        stockQuantity: 50
      };

      component.productForm.patchValue(validProduct);
      component.onSubmit();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        ...validProduct,
        id: undefined
      });
    });

    it('should preserve existing id when editing', () => {
      const editFixture = createComponent(mockProduct);
      const editComponent = editFixture.componentInstance;

      const updatedProduct: Omit<Product, 'id'> = {
        name: 'Updated Product',
        category: 'Updated Category',
        price: 200,
        stockQuantity: 100
      };

      editComponent.productForm.patchValue(updatedProduct);
      editComponent.onSubmit();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        ...updatedProduct,
        id: mockProduct.id
      });
    });
  });

  describe('Cancel Operation', () => {
    it('should close dialog without data when cancelled', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
  });
});
