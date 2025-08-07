# Estructura del proyecto

### node_modules
- Contiene las dependencias del proyecto instaladas.
- No se debe modificar manualmente.

### client/ — Interfaz de Usuario (Frontend)

La carpeta `client/` contiene todo el código relacionado con la interfaz gráfica de la aplicación, desarrollada con **React**, **TypeScript** y **Vite** como empaquetador.

#### Estructura interna

        ```bash
        client/
        ├── src/
        │   ├── assets/         # Archivos estáticos como imágenes (ej: logo)
        │   ├── components/     # Componentes reutilizables de UI
        │   │   ├── auth/       # Componentes relacionados con autenticación (Login, Register)
        │   │   └── ui/         # Elementos visuales como Alertas, Botones, etc.
        │   ├── blockchain/     # Módulos relacionados con blockchain (si aplica)
        │   ├── finance/        # Vistas o componentes relacionados con finanzas
        │   ├── layout/         # Estructura común como navbar, footer, contenedores
        │   ├── hooks/          # Custom Hooks para lógica reutilizable
        │   ├── lib/            # Librerías o utilidades (helpers, funciones generales)
        │   ├── pages/          # Vistas completas (pantallas principales)
        │   ├── services/       # Módulos para llamadas HTTP/API al backend
        │   ├── App.tsx         # Componente principal de la aplicación
        │   ├── main.tsx        # Punto de entrada de React
        │   └── index.css       # Estilos globales
        ├── index.html          # HTML principal que React inyecta

        ```

### server 

La carpeta `server/` contiene la lógica del backend desarrollada con **Express.js** y **TypeScript**. Esta capa se encarga de:

- Manejar rutas y lógica de negocio
- Gestionar la autenticación de usuarios
- Conectarse a la base de datos PostgreSQL
- Exponer endpoints para el frontend

#### Estructura de archivos

        ```bash
        server/
        ├── auth.ts      # Configuración de autenticación con Passport.js
        ├── db.ts        # Conexión y configuración de la base de datos (Drizzle, PostgreSQL)
        ├── index.ts     # Punto de entrada del servidor Express
        ├── routes.ts    # Definición de rutas de la API
        ├── storage.ts   # Funciones para interactuar con la base de datos (consultas y operaciones)
        └── vite.ts      # Registro de logs y configuración adicional para desarrollo
        ```

### shared

La carpeta `shared/` contiene los modelos TypeScript que definen las estructuras de datos utilizadas tanto por el **frontend** (`client/`) como por el **backend** (`server/`).

Esto permite compartir tipos y estructuras de forma segura y coherente entre ambas capas del proyecto, reduciendo errores y redundancia.

#### Contenido principal

```bash
shared/
└── schema.ts  # Tipos y esquemas comunes utilizados en la base de datos y lógica de negocio
```

### Archivos raíz y configuración

La raíz del proyecto contiene diversos archivos esenciales para la configuración del entorno, manejo de dependencias, y compilación tanto del backend como del frontend. A continuación, una descripción general:

- `.env`: Variables de entorno sensibles, como la URL de conexión a la base de datos o claves secretas de sesión. Permite que el código no dependa de valores fijos o inseguros.

- `package.json` y `package-lock.json`: Definen las dependencias, scripts de ejecución (como `npm run dev`), y la configuración general del proyecto Node.js.

- `drizzle.config.ts`: Archivo de configuración del ORM Drizzle, que gestiona la conexión a la base de datos y las migraciones.

- `tailwind.config.ts`: Configura TailwindCSS, especificando temas de colores, breakpoints, y otros estilos personalizados del frontend.

- `tsconfig.json`: Define cómo se compila el código TypeScript, incluyendo rutas, reglas y opciones del compilador.

- `vite.config.ts`: Configuración para el bundler Vite, encargado de compilar y servir el frontend React de forma rápida.

- `postcss.config.js`: Define cómo se procesa el CSS moderno usando herramientas como Tailwind y Autoprefixer.

Estos archivos trabajan en conjunto para permitir que el proyecto se ejecute correctamente tanto en desarrollo como en producción.