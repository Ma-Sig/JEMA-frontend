import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

type LoginView = 'login' | 'forgot-password' | 'forgot-password-sent' | 'contact';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {
  clientId: string = environment.googleClientId;
  currentView: LoginView = 'login';
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.handleCredentialResponse = (response: any) => {
        //const token = response.credential;
        const token = this.createFakeJwtToken('user-123');
        const user = this.decodeJwt(token);
        console.log('Google info:', user);
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('userId', '13');
        this.router.navigate(['/dashboard']);
      };
    }
  }

  private createFakeJwtToken(userId: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ userId }));
    const signature = 'signature';
    return `${header}.${payload}.${signature}`;
  }

  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(
      atob(base64Url)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(base64);
  }

  // Método para obtener clases CSS dinámicas para los inputs
  getInputClass(fieldName: string, formName: string = 'loginForm'): string {
    const form = formName === 'forgotPasswordForm' ? this.forgotPasswordForm : this.loginForm;
    const field = form.get(fieldName);

    if (!field?.touched) {
      return 'border-gray-300 focus:ring-blue-500 focus:border-transparent';
    }

    if (field.valid) {
      return 'border-green-300 focus:ring-green-500 focus:border-transparent';
    } else {
      return 'border-red-300 focus:ring-red-500 focus:border-transparent';
    }
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      let result = null;
      try {
        result = await this.authService.login(email, password);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: (error as any).error.error,
        });
        return;
      }

      if (result.token && result.userId) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        this.router.navigate(['/dashboard']);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales inválidas',
        });
      }

      // // Aquí implementarías la lógica de autenticación
      // console.log('Login attempt:', this.loginForm.value);
      // localStorage.setItem('token', 'fake-jwt-token');

      // const username = this.loginForm.get('username')?.value;
      // const fakeToken = this.createFakeJwtToken(username);

      // this.authService.getUserIdByEmail(username).subscribe({
      //   next: ({ id_usuario }) => {
      //     localStorage.setItem('userId', id_usuario);
      //   },
      //   error: (error) => {
      //     console.error('Error al obtener el user ID:', error);
      //   },
      // });

      // localStorage.setItem('token', fakeToken);

      // // Simular login exitoso y redirigir al dashboard
      // this.router.navigate(['/dashboard']);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.loginForm.markAllAsTouched();
    }
  }

  onSendResetEmail(): void {
    if (this.forgotPasswordForm.valid) {
      // Aquí implementarías la lógica para enviar el email de recuperación
      console.log('Reset email sent to:', this.forgotPasswordForm.value.email);

      // Cambiar a la vista de confirmación
      this.currentView = 'forgot-password-sent';
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  goToForgotPassword(): void {
    this.currentView = 'forgot-password';
    this.forgotPasswordForm.reset();
  }

  goToLogin(): void {
    this.currentView = 'login';
  }

  goToContact(): void {
    this.currentView = 'contact';
  }
}
