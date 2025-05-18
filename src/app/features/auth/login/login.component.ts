import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

type LoginView = 'login' | 'forgot-password' | 'forgot-password-sent' | 'contact';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  currentView: LoginView = 'login';
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      // Aquí implementarías la lógica de autenticación
      console.log('Login attempt:', this.loginForm.value);

      // Simular login exitoso y redirigir al dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  onSendResetEmail(): void {
    if (this.forgotPasswordForm.valid) {
      // Aquí implementarías la lógica para enviar el email de recuperación
      console.log('Reset email sent to:', this.forgotPasswordForm.value.email);

      // Cambiar a la vista de confirmación
      this.currentView = 'forgot-password-sent';
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
