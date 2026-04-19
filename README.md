# PwC Trivia - Respeto Sin Excepciones

Aplicación web interactiva para la prevención del hostigamiento sexual laboral, desarrollada para PwC Perú como parte del Hackathon +ChicasTec.

## 🚀 Características

- **Trivia Interactiva**: Evaluación de conocimientos sobre hostigamiento sexual
- **Sistema de Denuncias**: Plataforma segura para reportar incidentes
- **Dashboard Analítico**: Panel de control para visualizar estadísticas y denuncias
- **Información Educativa**: Contenido sobre prevención y derechos laborales
- **Responsive Design**: Optimizado para dispositivos móviles y desktop

## 🛠️ Tecnologías

- **React 19.2.0** - Framework principal
- **Vite 7.3.1** - Build tool y desarrollo
- **Firebase** - Base de datos y autenticación
- **React Router** - Navegación
- **GitHub Pages** - Despliegue

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/rossy1668/Pwc_Trivia.git
cd Pwc_Trivia

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🚀 Despliegue

### Despliegue Automático (GitHub Actions)

El proyecto está configurado para desplegar automáticamente en GitHub Pages cuando se hace push a las ramas `main` o `gh-pages`.

### Despliegue Manual

```bash
# Desplegar desde main
npm run deploy:main

# Desplegar desde gh-pages
npm run deploy:gh-pages

# O desplegar directamente
npm run deploy
```

### Configuración de GitHub Pages

1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
2. Selecciona **Deploy from a branch**
3. Elige la rama `gh-pages` y carpeta `/ (root)`
4. La URL será: `https://rossy1668.github.io/Pwc_Trivia`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas principales
├── assets/             # Estilos e imágenes
├── data/               # Datos estáticos
└── firebase.js         # Configuración de Firebase

public/
├── assets/             # Recursos estáticos
└── pages/              # Archivos HTML (legacy)
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa del build
- `npm run deploy` - Desplegar a GitHub Pages
- `npm run lint` - Ejecutar ESLint

## 🌐 Rutas de la Aplicación

- `/` - Redirección a login
- `/home` - Página principal
- `/trivia` - Trivia interactiva
- `/guia` - Guía de acción
- `/leyes` - Información legal
- `/acercade` - Acerca del micrositio
- `/hostigamiento` - ¿Qué es el hostigamiento?
- `/denuncia` - Formulario de denuncias
- `/login` - Inicio de sesión

## 📊 Dashboard Analítico

Accesible en `/analytics` (requiere autenticación), muestra:
- Estadísticas de participación en la trivia
- Tasas de aprobación y rendimiento
- Lista completa de denuncias registradas
- Insights y recomendaciones

## 🔒 Configuración de Firebase

Asegúrate de configurar las variables de entorno para Firebase en tu proyecto.

## 📝 Licencia

Desarrollado para PwC Perú - Hackathon +ChicasTec 2025
"El silencio no protege, el conocimiento sí."
