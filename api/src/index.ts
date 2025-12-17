import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();

// Configuración de CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://koetica.vercel.app', 'https://www.koetica.com']
      : 'http://localhost:3001',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Importar rutas
import contactRouter from './routes/contact.js';
import healthRouter from './routes/health.js';
// TODO: Descomentar cuando copies estos archivos del proyecto original:
// import categoriaRouter from './routes/categoria.js';
// import comercioRouter from './routes/comercio.js';
// import actividadesRouter from './routes/actividades.js';
// import productoRouter from './routes/producto.js';
// import campaignRouter from './routes/campaign.js';

// Ruta de ejemplo para verificar que la API funciona
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Koetica API funcionando correctamente',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Montar rutas con prefijo /api
app.use('/api', contactRouter);
app.use('/api', healthRouter);
// TODO: Descomentar cuando copies estos archivos del proyecto original:
// app.use('/api', categoriaRouter);
// app.use('/api', comercioRouter);
// app.use('/api', actividadesRouter);
// app.use('/api', productoRouter);
// app.use('/api', campaignRouter);

// Ruta para manejar rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Para Vercel serverless
export default app;
