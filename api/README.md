# Koetica API - Adaptada para Vercel y Localhost

Esta es una adaptación de la API de Koetica para funcionar tanto en Vercel (serverless) como en localhost.

## Estructura del Proyecto

```
api/
├── src/
│   ├── config/
│   │   └── database.ts       # Configuración de PostgreSQL
│   ├── routes/
│   │   ├── health.ts         # Ejemplo de ruta health
│   │   ├── contact.ts        # Copiar desde tu proyecto original
│   │   ├── categoria.ts      # Copiar desde tu proyecto original
│   │   ├── comercio.ts       # Copiar desde tu proyecto original
│   │   ├── actividades.ts    # Copiar desde tu proyecto original
│   │   ├── producto.ts       # Copiar desde tu proyecto original
│   │   └── campaign.ts       # Copiar desde tu proyecto original
│   ├── services/             # Copiar tus servicios originales
│   ├── types/                # Copiar tus tipos originales
│   ├── utils/                # Copiar tus utilidades originales
│   ├── index.ts              # App Express (usado por Vercel)
│   └── server.ts             # Servidor local
├── .env.example              # Plantilla de variables de entorno
├── package.json
├── tsconfig.json
├── vercel.json               # Configuración de Vercel
└── README.md
```

## Configuración

### 1. Copiar archivos del proyecto original

Necesitas copiar estos archivos desde tu proyecto original `koetica/apps/api`:

```bash
# Copiar todas las rutas
cp -r ../koetica/apps/api/src/routes/* ./src/routes/

# Copiar servicios
cp -r ../koetica/apps/api/src/services ./src/

# Copiar tipos
cp -r ../koetica/apps/api/src/types ./src/

# Copiar utilidades
cp -r ../koetica/apps/api/src/utils ./src/
```

### 2. Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:contraseña@host:5432/basedatos
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña
SMTP_SECURE=false
MAIL_TO=destinatario@example.com
```

### 3. Descomentar rutas en index.ts

Una vez hayas copiado todas las rutas, edita `src/index.ts` y descomenta las líneas:

```typescript
// Descomentar estas líneas:
import contactRouter from './routes/contact.js';
import healthRouter from './routes/health.js';
import categoriaRouter from './routes/categoria.js';
import comercioRouter from './routes/comercio.js';
import actividadesRouter from './routes/actividades.js';
import productoRouter from './routes/producto.js';
import campaignRouter from './routes/campaign.js';

// Y estas:
app.use('/api', contactRouter);
app.use('/api', healthRouter);
app.use('/api', categoriaRouter);
app.use('/api', comercioRouter);
app.use('/api', actividadesRouter);
app.use('/api', productoRouter);
app.use('/api', campaignRouter);
```

## Uso en Localhost

### Instalar dependencias

```bash
pnpm install
```

### Modo desarrollo (con hot reload)

```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:3001`

### Modo producción

```bash
# Compilar TypeScript
pnpm build

# Iniciar servidor
pnpm start
```

## Despliegue en Vercel

### Opción 1: Desde la línea de comandos

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel
```

### Opción 2: Desde el dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Selecciona la carpeta `api` como Root Directory
4. Configura las variables de entorno en el dashboard:
   - `DATABASE_URL`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_SECURE`
   - `MAIL_TO`
   - `NODE_ENV=production`
5. Despliega

### Configuración de variables de entorno en Vercel

En el dashboard de Vercel:
1. Ve a tu proyecto
2. Settings → Environment Variables
3. Agrega todas las variables del archivo `.env`

## Endpoints Disponibles

Una vez configurado, tendrás los siguientes endpoints:

- `GET /` - Información de la API
- `GET /api/health` - Estado de la API
- `POST /api/contact` - Enviar contacto
- `GET /api/categoria` - Categorías
- `GET /api/comercio` - Comercios
- `GET /api/actividades` - Actividades
- `GET /api/producto` - Productos
- `GET /api/campaign` - Campañas

## Diferencias entre Localhost y Vercel

### Localhost
- Usa `server.ts` como punto de entrada
- Crea un servidor HTTP con `app.listen()`
- Las rutas están disponibles en `http://localhost:3001`

### Vercel (Serverless)
- Usa `index.ts` como punto de entrada
- Exporta la app Express directamente
- Vercel maneja las peticiones HTTP
- Compilado a `dist/index.js` antes del despliegue

## Troubleshooting

### Error: "La variable DATABASE_URL no está configurada"
- Asegúrate de tener el archivo `.env` con la variable `DATABASE_URL`
- En Vercel, configura la variable de entorno en el dashboard

### Error: Module not found
- Verifica que hayas copiado todos los archivos necesarios
- Ejecuta `pnpm install` de nuevo

### CORS issues
- Actualiza los orígenes permitidos en `src/index.ts` línea 17-20
- Agrega tu dominio de producción

## Notas Importantes

1. **ES Modules**: Este proyecto usa ES Modules (`type: "module"` en package.json)
2. **Imports**: Usa extensión `.js` en los imports TypeScript (se transpila correctamente)
3. **PostgreSQL SSL**: En producción, SSL está configurado con `rejectUnauthorized: false`
4. **CORS**: Configurado para `localhost:3001` en desarrollo y dominios específicos en producción

## Próximos Pasos

1. Copiar todos los archivos de tu proyecto original
2. Actualizar las rutas en `src/index.ts`
3. Probar en localhost con `pnpm dev`
4. Desplegar en Vercel
5. Configurar variables de entorno en Vercel
6. Probar los endpoints en producción
