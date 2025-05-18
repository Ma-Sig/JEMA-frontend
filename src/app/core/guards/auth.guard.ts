import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private platformId = inject(PLATFORM_ID);

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      // En el servidor, no permitas acceso por defecto
      return of(false);
    }

    const loggedIn = this.authService.isLoggedIn();
    if (loggedIn) {
      return of(true);
    }

    // Redirección reactiva, previene doble navegación
    this.router.navigate(['/login'], { replaceUrl: true });
    return of(false);
  }
}
