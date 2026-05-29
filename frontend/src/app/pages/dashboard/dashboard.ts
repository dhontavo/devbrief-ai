import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenerateService } from '../../services/generate.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

interface Generation {
  id: number;
  doc_type: string;
  language: string;
  result: string;
  created_at: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  generations: Generation[] = [];
  used = 0;
  limit = 10;
  remaining = 10;
  loading = true;
  email = '';

  docTypeLabels: Record<string, string> = {
    readme: 'README',
    jsdoc: 'JSDoc',
    api: 'API Docs',
    summary: 'Resumen'
  };

  docTypeIcons: Record<string, string> = {
    readme: 'description',
    jsdoc: 'code',
    api: 'api',
    summary: 'notes'
  };

  constructor(
    private generateService: GenerateService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.email = this.authService.getEmail() || '';
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.generateService.getHistory().subscribe({
      next: (data: any[]) => {
        this.loading = false;

        if (!data || !Array.isArray(data) || data.length === 0) {
          this.generations = [];
          this.used = 0;
          this.remaining = this.limit;
          this.loading = false;
          // Mostrar mensaje de que no hay generaciones y detener el proceso
          // this.snackBar.open('No tienes generaciones', 'Cerrar', { duration: 3000 });
          return;
        }

        this.generations = data;
        this.used = data.length;
        this.remaining = this.limit - this.used;

        if (this.remaining <= 0) {
          this.snackBar.open('Has alcanzado tu límite de generaciones gratuitas', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.loading = false;
        this.snackBar.open('Error al cargar el historial', 'Cerrar', { duration: 3000 });
      }
    });
  }

  goToGenerator() {
    this.router.navigate(['/generator']);
  }

  copyResult(result: string) {
    navigator.clipboard.writeText(result).then(() => {
      this.snackBar.open('Copiado al portapapeles', '', { duration: 2000 });
    });
  }

  logout() {
    this.authService.logout();
  }

  get usagePercent(): number {
    return Math.round((this.used / this.limit) * 100);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  getLanguageClass(lang: string): string {
    const l = (lang || '').toLowerCase();
    if (l.includes('c#') || l.includes('cs') || l.includes('blue')) return 'lang-blue';
    if (l.includes('type') || l.includes('ts') || l.includes('vue')) return 'lang-green';
    if (l.includes('php') || l.includes('python')) return 'lang-yellow';
    if (l.includes('java') || l.includes('js')) return 'lang-grey';
    return 'lang-default';
  }


}