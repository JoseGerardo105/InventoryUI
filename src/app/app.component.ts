import { Component } from '@angular/core';
import { ListProductsComponent } from './components/list-products/list-products';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app-inventory-of-products';
}
