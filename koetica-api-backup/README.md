# Koetica API

API REST TypeScript con soporte para PostgreSQL, envío de emails y almacenamiento de archivos en Cloudinary, lista para desplegarse en Vercel.

## Características

- **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad
- **PostgreSQL**: Base de datos relacional con conexión mediante pool
- **Cloudinary**: Almacenamiento y gestión de imágenes en la nube
- **Nodemailer**: Envío de emails transaccionales
- **Express**: Framework web minimalista y flexible
- **Vercel**: Configurado para despliegue serverless

## Estructura del Proyecto

```
koetica-api/
├── src/
│   ├── api/              # Controladores de endpoints
│   │   ├── health.ts     # Health checks
│   │   ├── users.ts      # Gestión de usuarios
│   │   └── upload.ts     # Upload de archivos
│   ├── config/           # Configuración
│   │   └── database.ts   # Configuración PostgreSQL
│   ├── middleware/       # Middlewares
│   │   ├── upload.ts     # Configuración Multer
│   │   └── errorHandler.ts
│   ├── services/         # Servicios
│   │   ├── email.service.ts
│   │   └── cloudinary.service.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/            # Utilidades
│   │   ├── response.ts
│   │   └── validator.ts
│   ├── routes/           # Definición de rutas
│   │   └── index.ts
│   └── index.ts          # Punto de entrada
├── .env.example          # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── tsconfig.json
└── vercel.json
```

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/josepcanyelles/koetica-api.git
cd koetica-api
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
- **DATABASE_URL**: URL de conexión a PostgreSQL
- **SMTP_***: Configuración del servidor SMTP
- **CLOUDINARY_***: Credenciales de Cloudinary

4. Crea la tabla de usuarios en PostgreSQL:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Desarrollo

Ejecuta el servidor en modo desarrollo:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Build

Compila el proyecto TypeScript:
```bash
npm run build
```

## Despliegue en Vercel

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Inicia sesión:
```bash
vercel login
```

3. Despliega:
```bash
vercel
```

4. Configura las variables de entorno en Vercel:
   - Ve a tu proyecto en vercel.com
   - Settings > Environment Variables
   - Añade todas las variables del archivo `.env`

## API Endpoints

### Health Checks

- `GET /api/health` - Estado general de la API
- `GET /api/health/database` - Estado de la conexión a PostgreSQL
- `GET /api/health/email` - Estado del servicio de email

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (paginado)
  - Query params: `page`, `limit`
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
  - Body: `{ email, name, avatar? }`
- `PUT /api/users/:id` - Actualizar usuario
  - Body: `{ name?, avatar? }`
- `DELETE /api/users/:id` - Eliminar usuario

### Upload de Archivos

- `POST /api/upload` - Subir imagen
  - Form data: `file` (imagen)
  - Body: `folder` (opcional)
- `DELETE /api/upload` - Eliminar imagen
  - Body: `{ publicId }`
- `GET /api/upload/:publicId` - Obtener información de imagen

## Servicios

### EmailService

```typescript
import emailService from './services/email.service';

// Enviar email personalizado
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Asunto',
  html: '<p>Contenido</p>',
});

// Enviar email de bienvenida
await emailService.sendWelcomeEmail('user@example.com', 'Nombre Usuario');

// Enviar email de reseteo de contraseña
await emailService.sendPasswordResetEmail('user@example.com', 'token123');
```

### CloudinaryService

```typescript
import cloudinaryService from './services/cloudinary.service';

// Subir imagen
const result = await cloudinaryService.uploadImage(buffer, 'folder-name');

// Obtener URL optimizada
const url = cloudinaryService.getOptimizedUrl(publicId, {
  width: 800,
  height: 600,
  quality: 'auto',
});

// Eliminar imagen
await cloudinaryService.deleteFile(publicId);
```

### Database

```typescript
import { query, getClient } from './config/database';

// Query simple
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);

// Transacción
const client = await getClient();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users...');
  await client.query('INSERT INTO profiles...');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Configuración de PostgreSQL

Puedes usar cualquier proveedor de PostgreSQL:

- **Local**: PostgreSQL instalado localmente
- **Vercel Postgres**: Base de datos integrada de Vercel
- **Supabase**: PostgreSQL como servicio
- **Railway**: Hosting de bases de datos
- **Neon**: PostgreSQL serverless

## Configuración de Email

Ejemplos de configuración SMTP:

**Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=tu-api-key
```

## Tecnologías

- **TypeScript** - Lenguaje tipado
- **Express** - Framework web
- **PostgreSQL (pg)** - Base de datos
- **Nodemailer** - Envío de emails
- **Cloudinary** - Almacenamiento de archivos
- **Multer** - Upload de archivos
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-Origin Resource Sharing

## Licencia

MIT

## Autor

Josep Canyelles
