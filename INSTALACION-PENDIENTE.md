# 🚨 INSTALACIÓN PENDIENTE - Actividad 9

## Estado Actual ✅

**TODO EL CÓDIGO DE LA ACTIVIDAD 9 ESTÁ COMPLETO:**
- ✅ Navegación (AppNavigation.tsx)
- ✅ Layout compartido (AppLayout.tsx)
- ✅ 4 páginas (HomePage, TasksPage, TaskDetailPage, NotFoundPage)
- ✅ Utilidad de fecha (date.ts)
- ✅ Rutas configuradas en App.tsx y main.tsx
- ✅ Estilos CSS actualizados
- ✅ Componentes TaskItem y TaskList actualizados
- ✅ Documentación completa (README.md y preguntas de cierre)

## ❌ Problema Bloqueante

**No se puede instalar `react-router@7.18.4`** debido a:
- Error 403 Forbidden desde registry.npmjs.org
- Conexiones ECONNRESET (reset de red)
- Firewall/proxy institucional bloqueando npm

## 🔧 SOLUCIÓN: Cambiar de Red

### Opción 1: Usar datos móviles (RECOMENDADO)
```bash
# 1. Conecta tu Mac al hotspot de tu teléfono
# 2. Ve a la carpeta del proyecto:
cd "/Users/shumafire/Desktop/FILE/Tareas UES/FE Jalil ues/task-manager-frontend"

# 3. Instala las dependencias:
pnpm install

# 4. Verifica que funciona:
pnpm dev
```

### Opción 2: Usar internet de casa
```bash
# Conéctate a tu WiFi de casa y repite los pasos de Opción 1
```

### Opción 3: Usar otra red WiFi
```bash
# Cualquier red que NO sea de la universidad
# Repite los pasos de Opción 1
```

## 📋 Pasos Después de Instalar Exitosamente

1. **Probar la aplicación:**
   ```bash
   pnpm dev
   ```
   Abre http://localhost:5173 y verifica:
   - Navegación entre Home y Tasks
   - Ver detalle de una tarea
   - Ruta 404 (ir a /ruta-que-no-existe)

2. **Verificar que no hay errores:**
   ```bash
   pnpm lint
   pnpm build
   ```

3. **Hacer commit de todo:**
   ```bash
   git add .
   git commit -m "feat: agregar navegación y rutas con React Router (Actividad 9 - EC3 F1 A9)"
   git push
   ```

## 🎯 Archivos Creados para Actividad 9

### Nuevos archivos:
- `src/components/AppNavigation.tsx` - Navegación principal
- `src/layouts/AppLayout.tsx` - Layout compartido
- `src/pages/HomePage.tsx` - Página de inicio
- `src/pages/TasksPage.tsx` - Página de lista de tareas
- `src/pages/TaskDetailPage.tsx` - Página de detalle de tarea
- `src/pages/NotFoundPage.tsx` - Página 404
- `src/utils/date.ts` - Utilidad para formatear fechas
- `docs/preguntas-cierre-ec3-f1-a9.md` - Respuestas a preguntas

### Archivos modificados:
- `src/main.tsx` - Agregado BrowserRouter
- `src/App.tsx` - Configuración de rutas
- `src/components/TaskItem.tsx` - Link a detalle
- `src/components/TaskList.tsx` - Tipo de onDeleteTask
- `src/styles/index.css` - Estilos de navegación y páginas
- `package.json` - Agregado react-router 7.18.4
- `README.md` - Documentación actualizada

## 🌐 Verificar Conectividad (opcional)

Si quieres confirmar el problema antes de cambiar de red:
```bash
curl -I https://registry.npmjs.org/react-router
```

Si ves "403 Forbidden" o timeout, confirma que es problema de red.

## ⏭️ Próximas Actividades

Una vez que funcione la Actividad 9, quedan pendientes:
- ✅ Actividad 8 - COMPLETADA
- ✅ Actividad 9 - CÓDIGO COMPLETO (solo falta instalar)
- ⏸️ Actividad 10 - Pendiente
- ⏸️ Actividad 11 - Pendiente  
- ⏸️ Actividad 12 - Pendiente

---

**NOTA:** Este problema NO es culpa de tu código o configuración. Es una limitación de la red institucional de la universidad.
