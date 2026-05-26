import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GenerateService } from '../../services/generate.service';

@Component({
  selector: 'app-generator',
  imports: [Navbar, CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
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

  constructor(private generateService: GenerateService) { }

  ngOnInit() {
    // Initial state
  }

  get characterCount(): number {
    return this.code.length;
  }

  generate() {
    if (!this.code) return;
    this.isGenerating = true;

    this.docType = this.docTypes.find(t => t.value === this.docType)?.label || 'README para GitHub';

    this.generateService.generate(this.code, this.docType, this.language).subscribe({
      next: (response) => {
        this.result = response.result;
        this.isGenerating = false;
        this.remaining--;
      },
      error: (error) => {
        console.error('Error al generar documentación:', error);
        setTimeout(() => {
          this.result = "";
          this.isGenerating = false;
          this.remaining--;
        }, 1500);
      }
    });


  }

  copyResult() {
    navigator.clipboard.writeText(this.result);
  }
}
