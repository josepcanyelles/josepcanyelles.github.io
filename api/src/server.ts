import app from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base de datos: ${process.env.DATABASE_URL ? 'Configurada' : 'NO configurada'}`);
});
