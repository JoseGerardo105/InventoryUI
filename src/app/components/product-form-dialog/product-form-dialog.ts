import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../infrastructure/models/products/products.model';


@Component({
  selector: 'app-product-form-dialog',
  templateUrl: './product-form-dialog.html',
  standalone: true,
  styleUrl: './product-form-dialog.scss',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule]
})
export class ProductFormDialogComponent implements OnInit {


  productForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Product
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.isEditing = true;
      this.productForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = {
        ...this.productForm.value,
        id: this.data?.id
      };
      this.dialogRef.close(product);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}



