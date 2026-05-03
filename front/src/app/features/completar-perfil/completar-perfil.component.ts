import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface User {
  id: number;
  nom: string;
  email: string;
  cognom?: string;
  rol: string;
  photo?: string;
  data_naixement?: string;
  email_pares?: string;
}

@Component({
  selector: 'app-completar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './completar-perfil.component.html',
  styleUrl: './completar-perfil.component.css',
})
export class CompletarPerfilComponent {
  user = signal<User | null>(null);
  dataNaixement = signal<string>('');
  emailPares = signal<string>('');
  photoFile = signal<File | null>(null);
  photoPreview = signal<string>('');
  error = signal<string>('');
  carregant = signal<boolean>(false);

  esMenorEdat = computed(() => {
    const data = this.dataNaixement();
    if (!data) return false;
    const birthDate = new Date(data);
    const today = new Date();
    let edat = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      edat--;
    }
    return edat < 18;
  });

  private apiUrl = environment.backendUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.carregarUsuari();
  }

  carregarUsuari() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        this.error.set('La imatge no pot superar 2MB');
        return;
      }
      this.photoFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    this.error.set('');
    const data = this.dataNaixement();
    if (!data) {
      this.error.set('La data de naixement és requerida');
      return;
    }

    if (this.esMenorEdat() && !this.emailPares().trim()) {
      this.error.set('Com a menor d\'edat, has d\'indicar el correu dels pares/tutors');
      return;
    }

    this.carregant.set(true);

    const formData = new FormData();
    formData.append('data_naixement', data);
    formData.append('email_pares', this.emailPares());
    if (this.photoFile()) {
      formData.append('photo', this.photoFile()!);
    }

    const token = localStorage.getItem('token');
    this.http.patch<{ success: boolean; data: { perfil_complet: boolean } }>(
      `${this.apiUrl}/fullfill-user-profile`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (response) => {
        this.carregant.set(false);
        if (response.success) {
          const usuari = localStorage.getItem('user');
          if (usuari) {
            const userData = JSON.parse(usuari);
            userData.data_naixement = data;
            userData.email_pares = this.emailPares();
            localStorage.setItem('user', JSON.stringify(userData));
          }
          this.router.navigate(['/alumnes']);
        }
      },
      error: (err) => {
        this.carregant.set(false);
        this.error.set(err.error?.message || 'Error en guardar el perfil');
      }
    });
  }
}