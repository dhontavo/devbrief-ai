import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']); // Redirigir si ya está logueado
    }

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });

    this.registerForm.get('confirmPassword')?.addValidators((control: AbstractControl) => {
      const password = this.registerForm.get('password')?.value;
      return control.value === password ? null : { passwordMismatch: true };
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { email, password } = this.registerForm.value;

      this.authService.register(email, password).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // Guardar el token usando el servicio
          this.authService.saveToken(response.token, response.user.email);

          this.snackBar.open('¡Registro exitoso!', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Redirigir al usuario al dashboard o página principal
          this.router.navigate(['/']); // Asume que la ruta raíz es el dashboard. Cámbialo si es distinto.
        },
        error: (err) => {
          this.isLoading = false;
          let errorMsg = 'Error al registrarse. Intenta de nuevo.';
          if (err.status === 401) {
            errorMsg = 'Credenciales incorrectas.';
          } else if (err.error && err.error.message) {
            errorMsg = err.error.message;
          }

          this.snackBar.open(errorMsg, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}