# Guía de Migración - Koetica API

Esta guía te ayudará a migrar tu código existente a la nueva estructura adaptada para Vercel y localhost.

## Paso 1: Clonar tu repositorio original

```bash
# Desde el directorio padre de este proyecto
cd ..
git clone https://github.com/josepcanyelles/koetica.git
cd josepcanyelles.github.io/api
```

## Paso 2: Copiar archivos necesarios

### Copiar todas las rutas

```bash
# Desde el directorio api/
cp -r ../../koetica/apps/api/src/routes/*.ts ./src/routes/
```

### Copiar servicios (si existen)

```bash
cp -r ../../koetica/apps/api/src/services ./src/
```

### Copiar tipos (si existen)

```bash
cp -r ../../koetica/apps/api/src/types ./src/
```

### Copiar utilidades (si existen)

```bash
cp -r ../../koetica/apps/api/src/utils ./src/
```

## Paso 3: Ajustar imports

Debido al cambio a ES Modules, necesitas actualizar algunos imports:

### ANTES (CommonJS):
```typescript
import { Router } from 'express';
const router = Router();
export default router;
```

### DESPUÉS (ES Modules):
```typescript
import { Router } from 'express';
const router = Router();
export default router; // ✅ Esto sigue igual
```

### Para imports locales, agrega la extensión .js:

**ANTES:**
```typescript
import { sendContactMail } from '../services/mail';
```

**DESPUÉS:**
```typescript
import { sendContactMail } from '../services/mail.js';
```

## Paso 4: Actualizar src/index.ts

Una vez copiadas las rutas, edita `src/index.ts`:

### 1. Importar las rutas (líneas 9-15):

```typescript
import contactRouter from './routes/contact.js';
import healthRouter from './routes/health.js';
import categoriaRouter from './routes/categoria.js';
import comercioRouter from './routes/comercio.js';
import actividadesRouter from './routes/actividades.js';
import productoRouter from './routes/producto.js';
import campaignRouter from './routes/campaign.js';
```

### 2. Montar las rutas (líneas 34-40):

```typescript
app.use('/api', contactRouter);
app.use('/api', healthRouter);
app.use('/api', categoriaRouter);
app.use('/api', comercioRouter);
app.use('/api', actividadesRouter);
app.use('/api', productoRouter);
app.use('/api', campaignRouter);
```

## Paso 5: Verificar dependencias

Compara las dependencias de tu `package.json` original con el nuevo:

```bash
# Ver dependencias del proyecto original
cat ../../koetica/apps/api/package.json
```

Si falta alguna dependencia, agrégala:

```bash
pnpm add nombre-dependencia
# o para dev dependencies
pnpm add -D nombre-dependencia
```

## Paso 6: Ajustar configuración de base de datos (si es necesario)

Si tu proyecto original usa Sequelize ORM en lugar de pg directamente, actualiza `src/config/database.ts`:

### Para Sequelize:

```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('La variable DATABASE_URL no está configurada.');
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});
```

## Paso 7: Probar localmente

```bash
# Instalar dependencias
pnpm install

# Crear archivo .env
cp .env.example .env
# Edita .env con tus credenciales

# Ejecutar en modo desarrollo
pnpm dev
```

Prueba los endpoints:
```bash
# Health check
curl http://localhost:3001/api/health

# Tu endpoint principal
curl http://localhost:3001/
```

## Paso 8: Ajustes comunes necesarios

### Cambio de import/export para pg

**SI VES ESTE ERROR:**
```
TypeError: Router is not a constructor
```

**SOLUCIÓN en archivos que usan pg:**
```typescript
// ANTES
import { Pool } from 'pg';

// DESPUÉS
import pkg from 'pg';
const { Pool } = pkg;
```

### Problemas con tipos

Si TypeScript se queja de tipos, instala:
```bash
pnpm add -D @types/nombre-del-paquete
```

### Problemas con nodemailer

Si usas nodemailer, ajusta el import:
```typescript
// ANTES
import nodemailer from 'nodemailer';

// DESPUÉS
import nodemailer from 'nodemailer';
// Esto debería funcionar, pero si no:
import * as nodemailer from 'nodemailer';
```

## Paso 9: Preparar para Vercel

### Verificar que compila

```bash
pnpm build
```

Esto debe crear la carpeta `dist/` con tus archivos compilados.

### Verificar vercel.json

Asegúrate de que `vercel.json` apunta a `dist/index.js`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

## Paso 10: Desplegar

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar (primera vez)
vercel

# Despliegues posteriores
vercel --prod
```

## Checklist de Migración

- [ ] Repositorio original clonado
- [ ] Rutas copiadas a `src/routes/`
- [ ] Servicios copiados a `src/services/`
- [ ] Tipos copiados a `src/types/`
- [ ] Utilidades copiadas a `src/utils/`
- [ ] Imports actualizados con extensión `.js`
- [ ] `src/index.ts` actualizado con todas las rutas
- [ ] Archivo `.env` creado y configurado
- [ ] `pnpm install` ejecutado correctamente
- [ ] `pnpm dev` funciona sin errores
- [ ] Todos los endpoints probados localmente
- [ ] `pnpm build` compila correctamente
- [ ] Variables de entorno configuradas en Vercel
- [ ] Desplegado en Vercel
- [ ] Endpoints probados en producción

## Problemas Comunes

### 1. Error: Cannot find module

**Causa:** Falta agregar extensión `.js` en imports

**Solución:**
```typescript
// ❌ MAL
import { algo } from './archivo';

// ✅ BIEN
import { algo } from './archivo.js';
```

### 2. Error: DATABASE_URL no configurada

**Causa:** Falta archivo `.env` o variable no configurada en Vercel

**Solución:**
- Local: Crear `.env` con `DATABASE_URL`
- Vercel: Agregar variable en Settings → Environment Variables

### 3. Error: CORS

**Causa:** Origen no permitido

**Solución:** Actualiza en `src/index.ts`:
```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tu-dominio.vercel.app', 'https://www.tu-dominio.com']
    : 'http://localhost:3001',
  credentials: true,
};
```

### 4. Error 404 en Vercel

**Causa:** Ruta incorrecta en `vercel.json`

**Solución:** Verifica que `vercel.json` apunte a `dist/index.js`

## Soporte

Si encuentras problemas:
1. Revisa los logs: `pnpm dev` (local) o Vercel Dashboard (producción)
2. Verifica que todos los archivos necesarios estén copiados
3. Confirma que las variables de entorno estén configuradas
4. Comprueba que los imports usen la extensión `.js`
