import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'jema';
  showHeader = true;

  constructor(private router: Router) {
    // Escuchar cambios de ruta para ocultar/mostrar header
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url)
      )
      .subscribe((url) => {
        // Ocultar header en rutas específicas
        this.showHeader = !this.isRouteWithoutHeader(url);
      });
  }

  private isRouteWithoutHeader(url: string): boolean {
    const routesWithoutHeader = ['/login', '/register', '/forgot-password'];
    return routesWithoutHeader.some((route) => url.startsWith(route));
  }
}
