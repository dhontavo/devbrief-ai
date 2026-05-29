import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GenerateService } from '../../services/generate.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generator',
  imports: [Navbar, CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './generator.html',
  styleUrl: './generator.scss',
})
export class Generator implements OnInit {
  docType = 'readme';
  language = 'csharp';
  code = '';
  result = '';
  isGenerating = false;
  remaining = 6;

  docTypes = [
    { value: 'readme', label: 'README para GitHub' },
    { value: 'jsdoc', label: 'JSDoc / Comentarios' },
    { value: 'api', label: 'Documentación API' },
    { value: 'summary', label: 'Resumen funcional' }
  ];

  languages = [
    { value: 'csharp', label: 'C#' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' }
  ];

  constructor(
    private generateService: GenerateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Initial state
  }

  get characterCount(): number {
    return this.code.length;
  }

  generate() {
    if (!this.code) return;
    this.isGenerating = true;
    this.result = '';

    const selectedDocType = this.docType;

    this.generateService.generate(this.code, selectedDocType, this.language).subscribe({
      next: (response) => {
        this.result = response.result;
        this.isGenerating = false;
        this.remaining--;
        this.snackBar.open('Documentación generada con éxito', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al generar documentación:', error);
        this.isGenerating = false;
        const errorMsg = error.error?.detail || error.error?.error || 'Error al conectar con el servidor';
        this.snackBar.open(`Error: ${errorMsg}`, 'Cerrar', { duration: 5000 });
      }
    });


  }

  copyResult() {
    navigator.clipboard.writeText(this.result);
  }

  getDocTypeLabel(value: string): string {
    return this.docTypes.find(t => t.value === value)?.label || value;
  }
}
