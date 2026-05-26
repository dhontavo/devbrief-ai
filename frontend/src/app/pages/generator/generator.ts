import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  ngOnInit() {
    // Initial state
  }

  get characterCount(): number {
    return this.code.length;
  }

  generate() {
    if (!this.code) return;
    this.isGenerating = true;
    
    // Simulate API call for the mockup
    setTimeout(() => {
      this.result = `# AuthService\n\nServicio de autenticación que gestiona la generación y validación de tokens JWT para usuarios de la aplicación.\n\n## Instalación\n\n\`\`\`bash\ndotnet add package Microsoft.AspNetCore.Authentication.JwtBearer\n\`\`\`\n\n## Uso\n\n\`\`\`csharp\npublic async Task<string> GenerateToken(User user) {\n  // ...\n}\n\`\`\``;
      this.isGenerating = false;
      this.remaining--;
    }, 1500);
  }

  copyResult() {
    navigator.clipboard.writeText(this.result);
  }
}
