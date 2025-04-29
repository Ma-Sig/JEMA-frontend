import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'JEMA';
  showHeader: boolean = true;

  constructor(private router: Router) {
    // Suscribirse a los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      // Si la ruta es la página 404 (wildcard '**'), ocultamos el header
      if (this.router.url === '/page-not-found') {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    });
  }
}
