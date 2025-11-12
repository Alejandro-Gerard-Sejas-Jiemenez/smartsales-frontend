# Sistema de Avisos y Notificaciones Push

## Descripción
Módulo completo de gestión de avisos/notificaciones push para clientes móviles en SmartSales365.

## Características Implementadas

### Frontend Web (React)
✅ **Index de Avisos** (`AvisosIndex.jsx`)
- Listado completo de avisos con paginación
- Filtros por Estado y Tipo
- Búsqueda en tiempo real
- Acciones: Ver, Editar, Eliminar, Enviar
- Badges de colores para estados y tipos
- Estadísticas visuales (enviados, leídos)

✅ **Formulario de Avisos** (`AvisoForm.jsx`)
- Crear y editar avisos
- Validaciones en tiempo real
- Selección de destinatarios (todos o específicos)
- Programación de envío
- Fecha de expiración
- Imágenes y links de acción
- Sistema de prioridades (1-5)

✅ **Detalle de Aviso** (`AvisoDetalle.jsx`)
- Vista completa del aviso
- Estadísticas detalladas
- Tasa de lectura
- Lista de destinatarios
- Acción rápida de envío

✅ **Servicio API** (`avisoService.js`)
- CRUD completo
- Envío de notificaciones
- Obtención de estadísticas
- Manejo de errores y autenticación

## Estructura de Archivos

```
smartsales365-frontend/
└── src/
    ├── pages/
    │   └── dashboard/
    │       └── avisos/
    │           ├── AvisosIndex.jsx      # Listado principal
    │           ├── AvisoForm.jsx        # Crear/Editar
    │           └── AvisoDetalle.jsx     # Vista detallada
    ├── services/
    │   └── avisoService.js              # API service
    └── routes/
        └── router.jsx                    # Rutas configuradas
```

## Rutas Configuradas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/dashboard/avisos` | AvisosIndex | Listado de avisos |
| `/dashboard/avisos/create` | AvisoForm | Crear nuevo aviso |
| `/dashboard/avisos/:id` | AvisoDetalle | Ver detalle del aviso |
| `/dashboard/avisos/:id/edit` | AvisoForm | Editar aviso existente |

## Campos del Modelo de Aviso

### Información Básica
- **titulo**: Título del aviso (máx. 100 caracteres)
- **mensaje**: Contenido del mensaje
- **tipo**: Promoción, Oferta, Informativo, Urgente, Actualización
- **estado**: Activo, Inactivo, Programado, Enviado

### Destinatarios
- **enviar_a_todos**: Boolean (enviar a todos los clientes)
- **destinatarios**: Array de IDs de clientes específicos

### Programación
- **fecha_programada**: DateTime opcional para envío programado
- **fecha_expiracion**: DateTime opcional para expiración
- **fecha_envio**: DateTime real de envío (auto)

### Contenido Adicional
- **imagen_url**: URL de imagen opcional
- **link_accion**: URL de acción al hacer clic
- **prioridad**: Número del 1 al 5

### Estadísticas
- **total_enviados**: Total de notificaciones enviadas
- **total_leidos**: Total de avisos leídos

## Uso del Sistema

### 1. Crear un Nuevo Aviso

1. Ir a **Dashboard → Avisos**
2. Clic en **"Crear Aviso"**
3. Completar el formulario:
   - Título y mensaje (obligatorios)
   - Seleccionar tipo y estado
   - Elegir destinatarios (todos o específicos)
   - Opcional: programar fecha, agregar imagen/link
4. Clic en **"Crear Aviso"**

### 2. Enviar un Aviso

**Opción A: Envío Inmediato**
- En el listado, clic en el ícono de avión ✈️
- Confirmar el envío

**Opción B: Envío Programado**
- Al crear/editar, establecer "Fecha programada"
- El sistema enviará automáticamente en esa fecha

**Opción C: Desde el Detalle**
- Abrir el aviso
- Clic en **"Enviar Ahora"**

### 3. Gestionar Avisos

**Filtrar:**
- Por estado: Activo, Inactivo, Programado, Enviado
- Por tipo: Promoción, Oferta, etc.
- Por búsqueda de texto

**Editar:**
- Clic en el ícono de lápiz ✏️
- Modificar campos necesarios
- Guardar cambios

**Eliminar:**
- Clic en el ícono de basura 🗑️
- Confirmar eliminación

### 4. Ver Estadísticas

En la vista de detalle:
- **Total Enviados**: Cantidad de notificaciones enviadas
- **Total Leídos**: Cantidad de usuarios que leyeron
- **Tasa de Lectura**: Porcentaje de lectura

## Tipos de Avisos

### 🎁 Promoción (Rosa)
Para promociones y ofertas especiales

### 💰 Oferta (Naranja)
Para descuentos y ofertas limitadas

### ℹ️ Informativo (Azul)
Para información general

### ⚠️ Urgente (Rojo)
Para avisos urgentes

### 🔄 Actualización (Índigo)
Para actualizaciones del sistema

## Estados de Avisos

### ✅ Activo (Verde)
Aviso activo y visible

### ⚪ Inactivo (Gris)
Aviso desactivado

### 📅 Programado (Azul)
Aviso pendiente de envío programado

### 📨 Enviado (Púrpura)
Aviso ya enviado

## Integración con Backend

El frontend requiere que el backend tenga implementado:

```python
# Endpoints necesarios
GET    /api/avisos/           # Listar avisos
POST   /api/avisos/           # Crear aviso
GET    /api/avisos/{id}/      # Obtener aviso
PUT    /api/avisos/{id}/      # Actualizar aviso
PATCH  /api/avisos/{id}/      # Actualizar parcial
DELETE /api/avisos/{id}/      # Eliminar aviso
POST   /api/avisos/{id}/enviar/  # Enviar aviso
GET    /api/clientes/         # Listar clientes
```

## Próximas Mejoras

- [ ] Integración con Firebase Cloud Messaging (FCM)
- [ ] Templates de avisos predefinidos
- [ ] Editor rico de texto para mensajes
- [ ] Carga y gestión de imágenes
- [ ] Reportes y analíticas avanzadas
- [ ] Envío masivo programado
- [ ] A/B testing de avisos
- [ ] Segmentación avanzada de clientes

## Tecnologías Utilizadas

- **React 18**: Framework frontend
- **React Router 6**: Navegación
- **Axios**: Cliente HTTP
- **Heroicons**: Íconos
- **Tailwind CSS**: Estilos

## Notas de Desarrollo

- Todos los componentes usan Tailwind CSS
- Los formularios tienen validación completa
- Los servicios manejan tokens JWT automáticamente
- Las rutas están protegidas con ProtectedRoute
- El código sigue las mejores prácticas de React

## Soporte

Para cualquier duda o problema, revisar:
1. Console del navegador para errores frontend
2. Network tab para verificar llamadas API
3. Backend logs para errores del servidor
