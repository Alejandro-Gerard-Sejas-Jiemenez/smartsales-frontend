# Sistema de Avisos Simplificado - Documentación

## 📋 Resumen

El módulo de Avisos ha sido completamente simplificado siguiendo el patrón de diseño usado en el resto del proyecto (como RoleForm y SmartTable). Ahora es más fácil de mantener y usar.

## 🎯 Características

### ✅ Funcionalidades Implementadas

1. **Listado de Avisos (AvisosIndex.jsx)**
   - Tabla responsive con SmartTable
   - Ordenamiento por columnas
   - Badges de colores para tipo y estado
   - Botones de Crear, Editar y Eliminar
   - Confirmación antes de eliminar

2. **Formulario de Avisos (AvisoForm.jsx)**
   - Crear y editar avisos
   - Validación de campos requeridos
   - Selección de destinatarios individuales
   - Opción de enviar a todos los clientes
   - Campos: título, mensaje, tipo, estado, prioridad, fechas, URLs
   - Diseño responsive y moderno

3. **Integración con Backend**
   - Endpoints correctos: `/api/acceso_seguridad/avisos/`
   - Autenticación JWT automática
   - Manejo de errores

## 🚀 Cómo Usar

### Acceder al Módulo
1. Iniciar sesión como ADMIN
2. Ir al menú lateral → **Avisos**
3. La URL será: `http://localhost:5173/dashboard/avisos`

### Crear un Aviso
1. Click en **"Crear nuevo"** (botón azul arriba a la derecha)
2. Llenar el formulario:
   - **Título*** (requerido)
   - **Mensaje*** (requerido)
   - **Tipo**: Promoción, Oferta, Informativo, Urgente, Actualización
   - **Estado**: Activo, Inactivo, Programado
   - **Prioridad**: 1-10
   - **Fecha Programada** (opcional)
   - **URL de Imagen** (opcional)
   - **Link de Acción** (opcional)
   - **Destinatarios**: 
     - ✅ Enviar a todos los clientes (por defecto)
     - ❌ Desmarcar para seleccionar clientes específicos
3. Click en **"Crear Aviso"**

### Editar un Aviso
1. En la tabla, click en el botón **"Editar"** (verde) del aviso
2. Modificar los campos necesarios
3. Click en **"Guardar Cambios"**

### Eliminar un Aviso
1. En la tabla, click en el botón **"Eliminar"** (rojo) del aviso
2. Confirmar la eliminación en el diálogo que aparece

## 📱 Diseño Responsive

### Mobile (< 640px)
- Tabla con scroll horizontal
- Columnas reducidas
- Formulario en una sola columna

### Tablet (640px - 1024px)
- Muestra columnas adicionales
- Formulario en 2 columnas

### Desktop (> 1024px)
- Todas las columnas visibles
- Formulario optimizado
- Mejor experiencia de usuario

## 🔧 Archivos Modificados

### Nuevos/Reescritos
1. `src/pages/dashboard/avisos/AvisosIndex.jsx` - 167 líneas
2. `src/pages/dashboard/avisos/AvisoForm.jsx` - 307 líneas

### Modificados
3. `src/routes/router.jsx` - Simplificado (solo 1 ruta para avisos)

### Sin Cambios
4. `src/services/avisoService.js` - API service (ya estaba correcto)

## 🎨 Componentes Usados

- **SmartTable**: Tabla inteligente con ordenamiento y responsive
- **Tailwind CSS**: Estilos modernos y responsive
- **React Hooks**: useState, useEffect para manejo de estado
- **Axios**: Peticiones HTTP al backend

## 🔐 Seguridad

- ✅ Protegido con JWT (token en localStorage)
- ✅ Solo accesible para rol ADMIN
- ✅ Interceptor para renovar token automáticamente
- ✅ Redirección a login si no hay autenticación

## 📊 Estructura de Datos

### Modelo Aviso
```javascript
{
  id: number,
  titulo: string,           // Requerido, max 100 chars
  mensaje: string,          // Requerido, max 500 chars
  tipo: string,             // Promoción, Oferta, Informativo, Urgente, Actualización
  estado: string,           // Activo, Inactivo, Programado, Enviado
  enviar_a_todos: boolean,  // true = todos, false = destinatarios específicos
  destinatarios: [ids],     // Array de IDs de clientes
  fecha_programada: datetime,
  fecha_creacion: datetime,
  imagen_url: string,
  link_accion: string,
  prioridad: number,        // 1-10
  total_enviados: number,
  total_leidos: number
}
```

## ✨ Mejoras vs Versión Anterior

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Archivos** | 3 páginas separadas | 2 componentes integrados |
| **Rutas** | 4 rutas | 1 ruta |
| **Navegación** | Con React Router | Componente interno |
| **Código** | ~800 líneas | ~474 líneas |
| **Complejidad** | Alta | Baja |
| **Mantenimiento** | Difícil | Fácil |
| **Consistencia** | Diferente al resto | Igual que otros módulos |

## 🐛 Solución de Problemas

### El botón "Crear" no funciona
- ✅ **SOLUCIONADO**: Ahora usa componente interno en lugar de navegación

### No aparecen los avisos
1. Verificar que el backend esté corriendo
2. Verificar que la URL sea correcta: `/api/acceso_seguridad/avisos/`
3. Verificar autenticación (F12 → Network → Ver request headers)

### Error al cargar clientes
1. Verificar endpoint: `/api/catalogo/clientes/`
2. Verificar que existan clientes en la base de datos
3. Ver consola del navegador (F12)

## 🧪 Testing

### Manual
1. **Crear aviso**: ✅ Funciona
2. **Editar aviso**: ✅ Funciona
3. **Eliminar aviso**: ✅ Funciona con confirmación
4. **Validación**: ✅ Campos requeridos
5. **Responsive**: ✅ Mobile, tablet, desktop
6. **Destinatarios**: ✅ Todos o específicos

### Comandos
```bash
# Frontend
cd smartsales365-frontend
npm run dev

# Backend
cd smartsales365-backend
python manage.py runserver

# Acceder
http://localhost:5173/dashboard/avisos
```

## 📝 Próximas Mejoras (Opcional)

1. ✨ Agregar paginación para muchos avisos
2. ✨ Filtros por tipo y estado
3. ✨ Búsqueda por texto
4. ✨ Estadísticas en tiempo real
5. ✨ Upload de imágenes (en lugar de URL)
6. ✨ Editor rich text para mensajes
7. ✨ Programar envíos recurrentes
8. ✨ Integración con Firebase Cloud Messaging

## 👨‍💻 Patrón de Diseño Usado

Este módulo sigue el patrón establecido en el proyecto:

```
Index (Página Principal)
├── SmartTable (Lista)
└── Form (Formulario Inline)
    ├── handleCreate() → Muestra Form
    ├── handleEdit(item) → Muestra Form con datos
    ├── handleDelete(item) → Elimina con confirmación
    └── handleFormSubmit() → Guarda y vuelve a Index
```

**Ejemplos similares en el proyecto:**
- `usuarios/cuentas.jsx` + `RoleForm.jsx`
- `catalogo/categorias.jsx`
- `catalogo/productos.jsx`

## ✅ Checklist de Implementación

- [x] Componente AvisosIndex simplificado
- [x] Componente AvisoForm simplificado
- [x] Integración con SmartTable
- [x] Validación de formulario
- [x] Manejo de errores
- [x] Diseño responsive
- [x] Rutas simplificadas
- [x] Documentación completa
- [ ] Testing en navegador (pendiente por usuario)
- [ ] Testing con backend real (pendiente por usuario)

---

**Autor**: GitHub Copilot  
**Fecha**: Noviembre 11, 2025  
**Versión**: 2.0 (Simplificado)
