import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUsuarioRepositoryService } from 'src/app/features/usuario/infrastructure/firebase-usuario-repository.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  passwordResetForm: FormGroup;
  loading = false;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private usuarioService: FirebaseUsuarioRepositoryService
  ) {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  goToLogin() {
    this._router.navigate(['/auth/login']);
  }

  onSubmit() {
    if (this.passwordResetForm.invalid) {
      return;
    }

    const email = this.passwordResetForm.get('email')?.value;
    this.loading = true;

    this.usuarioService.restaurarContrasena(email).subscribe({
      next: () => {
        this.loading = false;
        this._toastr.success('Se ha enviado un correo electrónico para restablecer tu contraseña', 'Éxito', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-bottom-right'
        });
        this.goToLogin();
      },
      error: (error) => {
        this.loading = false;
        this._toastr.error('Ha ocurrido un error al intentar restablecer tu contraseña', 'Error', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-bottom-right'
        });
      }
    });
  }
}
