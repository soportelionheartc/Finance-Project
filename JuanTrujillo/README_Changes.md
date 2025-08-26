# Cambios y configuración para ejecutar la app web "Lion Heart Capital"

Este documento describe todos los pasos realizados para lograr que el proyecto funcione correctamente en entorno local usando WSL (Ubuntu), PostgreSQL y Node.js.

---

## 1. Estructura del proyecto

```bash
trabajo-app/
├── client/              # Frontend React + Vite
├── server/              # Backend Express + TypeScript
├── shared/              # Modelos compartidos (esquemas Drizzle)
├── .env                 # Variables de entorno globales
├── drizzle.config.ts    # Configuración de Drizzle ORM
```


## 2. Variables de entorno (.env)
Se creó el archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Configuración de la base de datos PostgreSQL
DATABASE_URL=postgresql://lhcuser:lhcpass@localhost:5432/lionheartdb

# Clave secreta para firmar sesiones de usuario
SESSION_SECRET=Segura123
```

Estas variables son necesarias para:
- Conectar el backend a la base de datos
- Firmar sesiones de usuarios
- Ejecutar migraciones con Drizzle ORM

## 3. Configuración de PostgreSQL en WSL

**Instalar PostgreSQL:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**Iniciar el servicio:**
```bash
sudo service postgresql start
```

**Crear usuario y base de datos:**
```bash
sudo -u postgres psql
```

Dentro del prompt de PostgreSQL:
```sql
CREATE USER lhcuser WITH PASSWORD 'lhcpass';
CREATE DATABASE lionheartdb OWNER lhcuser;
\q
```

## 4. Migraciones de base de datos con Drizzle

**Instalar dotenv para que Drizzle lea el archivo .env:**
```bash
npm install dotenv
```

**Ejecutar la migración desde la raíz del proyecto:**
```bash
npm run db:push  # Configura la base de datos
```

## 5. Cambios en el backend (server/)

**En `storage.ts`:**

Se agregó esta línea al inicio:
```ts
import 'dotenv/config';
```
Para asegurar que `process.env.DATABASE_URL` esté disponible.

## 6. Levantar la app

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Abrir en el navegador:**
http://localhost:5173

---

# Cambios para realizar a la app web

## Semana 1

~~- Redireccion correcta a las paginas respectivas de Acciones Colombia, en especifico a las empresas: Ecopetrol, Bancolombia, Grupo Argos.~~

~~- Placeholder del campo Contraseña en el formulario de inicio de sesión.~~

~~- Logo del landing page es diferente al del explorar servicios, se debe cambiar el logo del landing page por el mismo que se usa en el explorar servicios.~~

~~- Estilo de landing page y services se veian diferente y no se veian bien, se modificaron los estilos para que se vea mejor.~~

~~- La landing page esteticamente se veria mejor el titulo principal, texto inicial y boton de "Explorar Servicios" como esta en el resto de la app en diferentes secciones.:~~
~~    - LION HEART CAPITAL~~
~~    - FINANZAS E INVERSIONES DE ALTO IMPACTO~~
~~    - Soluciones financieras inteligentes impulsadas por IA para optimizar tus inversiones y estrategias de trading.~~
~~    - Explorar Servicios~~

~~- En la landing page, si el usuario intenta usar la funcionalidad de IA sin haber iniciado sesión, mejorar la alerta para que sea más clara y amigable, sugiriendo iniciar sesión o registrarse e incluso redirigir a la pagina de inicio de sesión.~~

~~- Corregir logo inicio de sesion y registro.~~

~~- En el inicio de sesión, si las credenciales son incorrectas o el usuario no existe, mostrar un mensaje de error más claro y amigable, sugiriendo verificar las credenciales o registrarse si no tiene cuenta.~~

~~- En la seccion de autenticacion sobra el h2 de "Inicio de Sesion" Ya que abajo esta para escoger si Iniciar sesión o Registrarse entonces seria mejor eliminarlo.~~

~~- En el panel de administración, al tope de todo que haya un margen al lado izquierdo para que no se vea tan pegado al borde de la pantalla.~~

~~- En panel de administracion los titulos de Panel de Administracion y Bienvenida mejorar la distribucion en la pantalla.~~

~~- Distribucion adecuada de los elementos de la seccion Usuarios en el Panel de Administracion.~~

~~- Secciones Usuarios, Sistema, Reportes mejorar la distribucion de la informacion porque se ve muy pegada y no se ve bien.~~

~~- Implementar boton de eliminar usuario y organizarlo en el div.~~

~~- En el panel de administración, en la seccion de Usuarios implementar los filtros adecuados, y funcionalidad de insertar y eliminar usuarios.~~

~~- En el panel admin, crear las paginas de perfil y configuracion.~~

~~-  En el panel de usuario de google o usuario comun, al tope de todo que haya un margen al lado izquierdo para que no se vea tan pegado al borde de la pantalla.~~

~~- En panel de usuario de googel o usuario comun, los titulos iniciales y Bienvenida mejorar la distribucion en la pantalla.~~

~~- En panel de usuario de googel o usuario comun, revisar las opciones de Perfil y Configuracion.~~

~~- En la base de datos estaba el usuario admin con rol de User, lo cual es incorrecto, se deberia cambiar a Admin. ~~

## Semana 2

~~- Que la applicacion sea muy amigable, gamificada y eduativa metiante mensajes a la hora de iniciar sesion como tips financieros o datos curiosos.~~

~~- Organizacion de la distribucion de los elementos al iniciar sesion, Resumen de portafolios.~~

~~- Funcionalidad de distribucion de Activos, POrtafolios.~~

~~- Implementar boton "Ver mas" que despliegue mas graficas de distintos tipos (modelos)~~

~~- Eliminar seccion de IA de la parte de los usuarios e implementarla como una seccion del menu desplegable del icono arriba a la derecha, que diga "Asistente Financiero" y al hacer click se despliegue un modal con la funcionalidad de IA.~~

~~- Arreglar footer con estilos mejores para los usuarios~~

~~- Funcionalidad de montar archivos en los usuarios en la seccion de graficas.~~

~~- Correccion footer de integracion con blockchein~~

## Semana 3

~~- Corregir estructura de la pagina de contacto~~

~~- Validacion del usuario a la hora de registrarse~~

~~- Funcionalidades principales del Home (Portfolio)~~

~~- Organizar toda la seccion de portafolio y funcionalidades~~

- Implemetnar funcinalidad de enviar correo desde la pagina de contacto (Esta a medias)

~~- Seccion Foro para el usuario~~

### Semana 4

- Implementar distintos tipos de graficas en la seccion de graficas del usuario

- Mensaje de eliminar un reply o publicacion en el foro

- Consitencia entre tablas y bd.

- Investigar sobre modelos de IA para la app y base de datos para la aplicacion movil.


# Comandos Versiones viejas

```bash
git log --oneline
git stash
git checkout <hash_commit>
 git checkout main
git stash pop 
```
