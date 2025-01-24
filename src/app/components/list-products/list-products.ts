import { Component, inject, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { ProductService } from '../../infrastructure/services/products/products.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../infrastructure/models/products/products.model';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog';
import Swal from "sweetalert2";

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.html',
  standalone: true,
  styleUrl: './list-products.scss',
  imports: [MatTableModule, MatIconModule, MatButtonModule]
 })
export class ListProductsComponent implements OnInit {

  title = 'app-inventory-of-products';
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stockQuantity', 'edit', 'delete'];
  dataSource = [];

  private readonly productService = inject(ProductService);


  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}


  async ngOnInit(): Promise<void> {
    this.getProducts();
  }

  openFormDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '800px',
      data: product || {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result.id) {
          this.onUpdateProduct(result);
        } else {
          this.confirmCreateProduct(result);
        }
      }
    });
  }


  async getProducts() {
    try {
      const data = await this.productService.getProducts();
      this.dataSource = data.result;
    } catch (error) {
      this.dataSource = [];
      console.log(error);
    }
  }

  async createProduct(product: Product) {
    try {
      await this.productService.createProduct(product);
      this.getProducts();
      Swal.fire({
        title: "Creación producto",
        text: `Producto creado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      this.dataSource = [];
      console.log(error);
    }
  }

  confirmCreateProduct(product: Product): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas agregar este producto?",
      icon: 'warning',
      confirmButtonText: "Si, agregar",
      cancelButtonText: "Cancelar",
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.createProduct(product);
        this.snackBar.open('Producto agregado exitosamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }


  async onUpdateProduct(idProduct: Product) {

    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Desea actualizar el producto?`,
      icon: "warning",
      confirmButtonText: "Si, actualizar",
      cancelButtonText: "Cancelar",
      showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateProduct(idProduct)
          this.snackBar.open('Producto agregado exitosamente', 'Cerrar', {
            duration: 3000
          });
      }
    });

  }



  async updateProduct(product:  Product) {
    try {
      if (product.id !== undefined) {
        await this.productService.updateProduct(product.id, product);

        this.getProducts();
        Swal.fire({
          title: "Actualización producto",
          text: `Producto actualizado correctamente.`,
          icon: "success",
          confirmButtonText: "Aceptar"
        });
    } else {
      console.error('Product ID is undefined');
    }
    } catch (error) {
      console.log(error);
    }

  }


  async onDeleteProduct(idProduct: number){
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Desea eliminar el producto con id ${idProduct}?`,
      icon: "warning",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      await this.deleteProduct(idProduct);
      this.snackBar.open('Producto agregado exitosamente', 'Cerrar', {
        duration: 3000
      });
    }
  }

  async deleteProduct(idProduct: number){
    try {
      await this.productService.deleteProduct(idProduct);
      this.getProducts();
      Swal.fire({
        title: "Eliminación producto",
        text: `Producto eliminado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      this.dataSource = [];
      console.log(error);
    }
  }
}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



