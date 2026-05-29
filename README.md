# 🤖 DevBrief AI

> Genera resúmenes inteligentes de repositorios de GitHub usando IA — en segundos.

---

## ¿Qué hace?

**DevBrief AI** analiza un repositorio de GitHub y produce un briefing claro y legible sobre qué hace el proyecto, qué tecnologías usa y cómo está estructurado. Útil para desarrolladores que necesitan entender rápidamente un codebase nuevo, o para equipos que quieren documentar proyectos sin esfuerzo manual.

---

## ✨ Funcionalidades

- 📦 Análisis automático de la estructura de un repositorio
- 🧠 Generación de resúmenes con IA (OpenIA API)
- 🖥️ Interfaz web intuitiva para ingresar y visualizar resultados
- ⚡ Respuestas rápidas mediante integración directa con la API de Anthropic

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | TypeScript · HTML · SCSS |
| Backend | Node.js · JavaScript |
| IA |OpenIA API |
| Control de versiones | Git · GitHub |

---

## 📁 Estructura del proyecto

```
devbrief-ai/
├── frontend/   # Interfaz de usuario (TypeScript + HTML + SCSS)
└── backend/    # Servidor y lógica de integración con la API
```

---

## 🚀 Cómo ejecutarlo localmente

### Prerrequisitos

- Node.js v18+
- Una API key de OpenIA ([obtener aquí](https://platform.openai.com/))

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/dhontavo/devbrief-ai.git
cd devbrief-ai

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### Variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
OPENAI_API_KEY=tu_api_key_aquí
```

### Ejecutar

```bash
# Backend
cd backend && npm start

# Frontend (en otra terminal)
cd frontend && npm start
```

---

## 💡 Contexto del proyecto

Este proyecto nació como mi primera exploración práctica con inteligencia artificial generativa. La idea fue clara desde el inicio: en lugar de solo consumir IA como usuario, quería **construir algo con ella**.

Aprendí a integrar una API de IA en una aplicación real, estructurar un proyecto fullstack y pensar en cómo la IA puede resolver problemas concretos de desarrollo de software.

---

## 👨‍💻 Autor

**dhontavo** — [github.com/dhontavo](https://github.com/dhontavo)
