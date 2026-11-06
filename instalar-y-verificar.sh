#!/bin/bash

# Script para instalar dependencias y verificar que todo funciona
# Ejecutar cuando tengas conexión a internet funcional (no WiFi universidad)

echo "🚀 Instalando dependencias de la Actividad 9..."
echo ""

# Limpiar instalaciones previas
echo "🧹 Limpiando archivos anteriores..."
rm -rf node_modules

# Instalar dependencias
echo ""
echo "📦 Instalando con pnpm..."
pnpm install

# Verificar si la instalación fue exitosa
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Instalación exitosa!"
    echo ""
    echo "🔍 Verificando que no hay errores de TypeScript..."
    pnpm build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ ¡Build exitoso! Todo está funcionando correctamente."
        echo ""
        echo "📋 Próximos pasos:"
        echo "1. Ejecuta: pnpm dev"
        echo "2. Abre: http://localhost:5173"
        echo "3. Prueba la navegación entre páginas"
        echo "4. Verifica que puedes ver el detalle de una tarea"
        echo "5. Haz commit: git add . && git commit -m 'feat: actividad 9 completa'"
        echo "6. Sube a GitHub: git push"
        echo ""
        echo "🎉 ¡Actividad 9 lista para entregar!"
    else
        echo ""
        echo "⚠️  Hay errores en el build. Revisa la salida arriba."
    fi
else
    echo ""
    echo "❌ Error en la instalación."
    echo ""
    echo "Posibles causas:"
    echo "- Aún estás en la red de la universidad (prueba con datos móviles)"
    echo "- Problemas de conexión a internet"
    echo ""
    echo "Solución: Cambia a otra red WiFi o usa datos móviles de tu teléfono"
fi
