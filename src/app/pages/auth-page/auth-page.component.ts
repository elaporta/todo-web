// dependencies
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export default class AuthPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  showRegisterModal = false;

  get email() {
    return this.authForm.get('email')!;
  }

  async onSubmit() {
    if(this.authForm.invalid) return;

    this.isLoading = true;

    this.authService.login(this.email.value).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
        this.isLoading = false;
      },
      error: (error) => {
        if(error && typeof error === 'object' && 'status' in error && error.status === 401) {
          this.showRegisterModal = true;
        }
        this.isLoading = false;
      }
    });
  }

  async register() {
    this.isLoading = true;

    this.authService.register(this.email.value).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
        this.isLoading = false;
        this.showRegisterModal = false;
      },
      error: () => {
        this.isLoading = false;
        this.showRegisterModal = false;
      }
    });
  }

  closeModal() {
    this.showRegisterModal = false;
  }
}