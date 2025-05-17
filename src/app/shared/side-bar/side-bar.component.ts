import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  faqs = [
    { question: '¿Cómo ingresar el inventario?', answer: 'Desde el módulo de inventarios...' },
    { question: '¿Cómo buscar los ítems?', answer: 'Puedes usar la barra de búsqueda...' },
    { question: '¿Cómo registrar usuarios?', answer: 'Ve al módulo de cuentas de usuario...' }
  ];

  selected: number | null = null;

  toggle(i: number) {
    this.selected = this.selected === i ? null : i;
  }
}
