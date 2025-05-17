import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() class: string = '';
  @Input() label: string = 'Add Item';
  @Input() readonly: boolean = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter();

  onClick(event: MouseEvent): void {
    // Ejecuta la lógica del evento ripple
    const button = event.currentTarget as HTMLElement;

    // Crear y posicionar el elemento ripple
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    // Emitir el evento cuando el botón sea presionado
    this.clicked.emit();

    console.log('Button clicked!');
  }
}
