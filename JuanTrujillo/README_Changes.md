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

~~- Redireccion correcta a las paginas respectivas de Acciones Colombia, en especifico a las empresas: Ecopetrol, Bancolombia, Grupo Argos.~~

~~- Placeholder del campo Contraseña en el formulario de inicio de sesión.~~

~~- Logo del landing page es diferente al del explorar servicios, se debe cambiar el logo del landing page por el mismo que se usa en el explorar servicios.~~

~~- Estilo de landing page y services se veian diferente y no se veian bien, se modificaron los estilos para que se vea mejor.~~

~~- La landing page esteticamente se veria mejor el titulo principal, texto inicial y boton de "Explorar Servicios" como esta en el resto de la app en diferentes secciones.:~~
~~    - LION HEART CAPITAL~~
~~    - FINANZAS E INVERSIONES DE ALTO IMPACTO~~
~~    - Soluciones financieras inteligentes impulsadas por IA para optimizar tus inversiones y estrategias de trading.~~
~~    - Explorar Servicios~~

- Links de las noticias en la landing page que redirijan a donde es.

~~- En la landing page, si el usuario intenta usar la funcionalidad de IA sin haber iniciado sesión, mejorar la alerta para que sea más clara y amigable, sugiriendo iniciar sesión o registrarse e incluso redirigir a la pagina de inicio de sesión.~~

~~- Corregir logo inicio de sesion y registro.~~

[~] En el inicio de sesión, si las credenciales son incorrectas o el usuario no existe, mostrar un mensaje de error más claro y amigable, sugiriendo verificar las credenciales o registrarse si no tiene cuenta. [~]

~~- En la seccion de autenticacion sobra el h2 de "Inicio de Sesion" Ya que abajo esta para escoger si Iniciar sesión o Registrarse entonces seria mejor eliminarlo.~~

~~- En el panel de administración, al tope de todo que haya un margen al lado izquierdo para que no se vea tan pegado al borde de la pantalla.~~

~~- En panel de administracion los titulos de Panel de Administracion y Bienvenida mejorar la distribucion en la pantalla.~~

~~- Distribucion adecuada de los elementos de la seccion Usuarios en el Panel de Administracion.~~

~~- Secciones Usuarios, Sistema, Reportes mejorar la distribucion de la informacion porque se ve muy pegada y no se ve bien.~~

~~- Implementar boton de eliminar usuario y organizarlo en el div.~~

- En el panel de administración, en la seccion de Usuarios implementar los filtros adecuados, y funcionalidad de insertar y eliminar usuarios.

- En el panel de administracion, en la seccion de sistema, funcionalidad de configuracion de la app.

- En el panel de administracion, en la seccion de Reportes, funcionalidad de Mostrar todos los reportes, Generar Reporte.

~~- En el panel admin, crear las paginas de perfil y configuracion.~~

- Ver que se quiere poner en las paginas de perfil y configuración.

~~-  En el panel de usuario de google o usuario comun, al tope de todo que haya un margen al lado izquierdo para que no se vea tan pegado al borde de la pantalla.~~

~~- En panel de usuario de googel o usuario comun, los titulos iniciales y Bienvenida mejorar la distribucion en la pantalla.~~

~~- En panel de usuario de googel o usuario comun, revisar las opciones de Perfil y Configuracion.~~

- Ver que se quiere poner en las paginas de perfil y configuración en los usuarios normales y de google.

- En panel de usuario de googel o usuario comun, implementar funcionalidades de Nuevos Portafolios, Revisar funcionamiento de las graficas, y organizar el display de a partir de la seccion Asistente Financiero, que se vea mejor la distribucion de los elementos ya que estan una encima de otras y no se ve bien.

- Todo lo anterior relacionado con el panel de usuario de google o usuario comun se debe tambien hacer para el usuario de apple.

~~- En la base de datos estaba el usuario admin con rol de User, lo cual es incorrecto, se deberia cambiar a Admin. ~~