# Lion Heart Capital - Aplicación de Finanzas Descentralizada

## Descripción del Proyecto

Plataforma financiera integral para Lion Heart Capital que ofrece inteligencia de mercado en tiempo real y gestión de activos digitales potenciada por blockchain con experiencia de usuario mejorada y tecnologías interactivas.

## Tecnologías Principales

- **Frontend**: React con visualizaciones de mercado dinámicas y microinteracciones
- **Base de Datos**: PostgreSQL con gestión integral de usuarios y activos
- **Blockchain**: Integración multi-blockchain (Ethereum, Solana, Bitcoin)
- **Datos de Mercado**: Agregación de datos de mercado en tiempo real con precios precisos
- **APIs Financieras**: APIs avanzadas de datos financieros (Investing.com, Yahoo Finance, CoinMarketCap)
- **Soporte Multiidioma**: Español e Inglés

## Estructura del Proyecto

### Backend (`/server`)

- `index.ts` - Servidor principal Express
- `routes.ts` - Rutas de la API
- `auth.ts` - Sistema de autenticación con Passport.js
- `storage.ts` - Capa de abstracción de almacenamiento
- `db.ts` - Configuración de la base de datos con Drizzle ORM

### Frontend (`/client`)

- `src/App.tsx` - Componente principal y enrutador
- `src/pages/` - Páginas de la aplicación
  - `landing-page.tsx` - Página de inicio pública
  - `auth-page.tsx` - Página de autenticación
  - `home-page.tsx` - Dashboard principal (requiere autenticación)
  - `blockchain-portfolio-page.tsx` - Portafolio blockchain
  - `chat-descentralizado-page.tsx` - Chat descentralizado
  - `finanzas-personales-page.tsx` - Finanzas personales
  - `trading-bot-page.tsx` - Bots de trading
  - `admin-page.tsx` - Panel de administración
- `src/components/` - Componentes reutilizables
- `src/hooks/` - Hooks personalizados (useAuth)
- `src/lib/` - Utilidades y configuraciones

### Base de Datos (`/shared`)

- `schema.ts` - Esquemas de Drizzle ORM para PostgreSQL

## Características Principales

### Autenticación y Autorización

- Sistema de autenticación tradicional (usuario/contraseña)
- Integración con wallets blockchain (MetaMask, Phantom)
- Roles de usuario (admin, usuario regular)
- Usuarios especiales con acceso a funciones blockchain

### Funcionalidades Blockchain

- Conexión con wallets Ethereum (MetaMask)
- Conexión con wallets Solana (Phantom)
- Portafolio automático para usuarios con wallets conectadas
- Análisis de rendimiento con gráficos AI

### Chat Descentralizado

- Sistema de chat en tiempo real
- Enfocado en discusiones de blockchain y finanzas
- Interfaz optimizada para móviles

### Datos de Mercado

- Integración con múltiples fuentes de datos financieros
- Precios en tiempo real 24/7/365
- Soporte para mercados colombianos (BVC) y estadounidenses
- Datos de criptomonedas desde CoinMarket

### IA y Automatización

- Chat bot de IA para asesoramiento financiero
- Análisis automatizado de portafolios
- Herramientas de trading con promedios móviles

## Usuarios del Sistema

### Usuarios Especiales

- **jplhc**: Administrador con acceso completo
- **juanpablo13**: Usuario con acceso a funciones blockchain

### Credenciales de Administrador

- Usuario: `jplhc`
- Contraseña: `2025lhc`

## Configuración de Desarrollo

### Requisitos Previos

- Node.js 20+
- PostgreSQL
- Variables de entorno configuradas

### Instalación

```bash
npm install
npm run db:push  # Configura la base de datos
npm run dev      # Inicia el servidor de desarrollo
```

### Variables de Entorno Requeridas

- `DATABASE_URL` - URL de conexión a PostgreSQL
- `SESSION_SECRET` - Secreto para sesiones
- `OPENAI_API_KEY` - (Opcional) Para funcionalidades de IA
- `FINANCIAL_API_KEY` - (Opcional) Para datos financieros

## Arquitectura

### Modelo Freemium

- Acceso libre a ciertas funcionalidades
- Funcionalidades premium requieren autenticación:
  - Análisis de portafolio
  - Trading automatizado
  - Integración blockchain

### Diseño Responsivo

- Optimizado para dispositivos móviles
- Interfaz adaptativa para tablet y desktop
- Tema oscuro con acentos dorados

### Seguridad

- Autenticación basada en sesiones
- Validación de datos con Zod
- Protección de rutas sensibles
- Almacenamiento seguro de credenciales

## Contacto

- Email: lionheartcapital1303@gmail.com
- Empresa: Lion Heart Capital S.A.S.

## Notas Técnicas

- El proyecto está configurado para despliegue en Replit
- Utiliza Vite para el desarrollo frontend
- Base de datos PostgreSQL con Drizzle ORM
- Autenticación con Passport.js y express-session
- UI construida con shadcn/ui y Tailwind CSS

## Estado del Proyecto

Aplicación completamente funcional con todas las características principales implementadas, lista para revisión técnica y posible despliegue.
