#!/bin/bash

# Script para copiar archivos del proyecto original
# Uso: ./copy-files.sh /ruta/al/proyecto/koetica

set -e  # Salir si hay algún error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Script de Migración Koetica API ===${NC}\n"

# Verificar que se proporcione la ruta
if [ -z "$1" ]; then
    echo -e "${RED}Error: Debes proporcionar la ruta al proyecto koetica${NC}"
    echo "Uso: ./copy-files.sh /ruta/al/proyecto/koetica"
    echo "Ejemplo: ./copy-files.sh ../../koetica"
    exit 1
fi

KOETICA_PATH="$1/apps/api"

# Verificar que existe el directorio
if [ ! -d "$KOETICA_PATH" ]; then
    echo -e "${RED}Error: No se encuentra el directorio $KOETICA_PATH${NC}"
    exit 1
fi

echo -e "${YELLOW}Copiando archivos desde: $KOETICA_PATH${NC}\n"

# Copiar rutas
echo "📁 Copiando rutas..."
if [ -d "$KOETICA_PATH/src/routes" ]; then
    # No copiar health.ts si ya existe (es nuestro ejemplo)
    for file in "$KOETICA_PATH/src/routes"/*.ts; do
        filename=$(basename "$file")
        if [ "$filename" != "health.ts" ] || [ ! -f "./src/routes/health.ts" ]; then
            cp "$file" "./src/routes/"
            echo "  ✓ Copiado: $filename"
        fi
    done
else
    echo -e "  ${YELLOW}⚠ No se encontró el directorio de rutas${NC}"
fi

# Copiar servicios
echo -e "\n📦 Copiando servicios..."
if [ -d "$KOETICA_PATH/src/services" ]; then
    cp -r "$KOETICA_PATH/src/services"/* "./src/services/" 2>/dev/null || mkdir -p "./src/services"
    cp -r "$KOETICA_PATH/src/services"/* "./src/services/"
    echo "  ✓ Servicios copiados"
else
    echo -e "  ${YELLOW}⚠ No se encontró el directorio de servicios${NC}"
fi

# Copiar tipos
echo -e "\n🔤 Copiando tipos..."
if [ -d "$KOETICA_PATH/src/types" ]; then
    cp -r "$KOETICA_PATH/src/types"/* "./src/types/" 2>/dev/null || mkdir -p "./src/types"
    cp -r "$KOETICA_PATH/src/types"/* "./src/types/"
    echo "  ✓ Tipos copiados"
else
    echo -e "  ${YELLOW}⚠ No se encontró el directorio de tipos${NC}"
fi

# Copiar utilidades
echo -e "\n🔧 Copiando utilidades..."
if [ -d "$KOETICA_PATH/src/utils" ]; then
    cp -r "$KOETICA_PATH/src/utils"/* "./src/utils/" 2>/dev/null || mkdir -p "./src/utils"
    cp -r "$KOETICA_PATH/src/utils"/* "./src/utils/"
    echo "  ✓ Utilidades copiadas"
else
    echo -e "  ${YELLOW}⚠ No se encontró el directorio de utilidades${NC}"
fi

echo -e "\n${GREEN}✅ Archivos copiados exitosamente!${NC}\n"

echo -e "${YELLOW}Próximos pasos:${NC}"
echo "1. Actualiza src/index.ts para importar y usar las rutas"
echo "2. Revisa los imports y agrega extensión .js donde sea necesario"
echo "3. Crea el archivo .env con tus credenciales"
echo "4. Ejecuta: pnpm install"
echo "5. Ejecuta: pnpm dev"
echo ""
echo "Consulta MIGRATION_GUIDE.md para más detalles"
