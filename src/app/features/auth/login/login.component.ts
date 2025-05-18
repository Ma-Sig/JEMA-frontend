import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      rememberMe: [false],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Validador personalizado para fortaleza de contraseña
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    const hasMinLength = value.length >= 8;

    const passwordValid =
      hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && hasMinLength;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  // Métodos para verificar criterios individuales de la contraseña
  hasUppercase(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /[A-Z]+/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /[a-z]+/.test(password);
  }

  hasNumber(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /[0-9]+/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
  }

  hasMinLength(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return password.length >= 8;
  }

  // Calcular fortaleza de la contraseña
  getPasswordStrengthScore(): number {
    let score = 0;
    if (this.hasUppercase()) score++;
    if (this.hasLowercase()) score++;
    if (this.hasNumber()) score++;
    if (this.hasSpecialChar()) score++;
    if (this.hasMinLength()) score++;
    return score;
  }

  getPasswordStrengthPercentage(): number {
    return (this.getPasswordStrengthScore() / 5) * 100;
  }

  getPasswordStrengthLabel(): string {
    const score = this.getPasswordStrengthScore();
    if (score <= 1) return 'Muy débil';
    if (score <= 2) return 'Débil';
    if (score <= 3) return 'Media';
    if (score <= 4) return 'Fuerte';
    return 'Muy fuerte';
  }

  getPasswordStrengthBarClass(): string {
    const score = this.getPasswordStrengthScore();
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  }

  getPasswordStrengthTextClass(): string {
    const score = this.getPasswordStrengthScore();
    if (score <= 1) return 'text-red-500';
    if (score <= 2) return 'text-orange-500';
    if (score <= 3) return 'text-yellow-600';
    if (score <= 4) return 'text-blue-500';
    return 'text-green-500';
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

  onLogin(): void {
    if (this.loginForm.valid) {
      // Aquí implementarías la lógica de autenticación
      console.log('Login attempt:', this.loginForm.value);

      // Simular login exitoso y redirigir al dashboard
      this.router.navigate(['/dashboard']);
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
