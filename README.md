# Espacio Evento - Frontend

<p align="center">
  <img src="https://nextjs.org/static/blog/next-15/twitter-card.png" width="600" alt="Next.js Logo" />
</p>

## Descripción

Frontend del sistema de gestión de eventos desarrollado con Next.js 16, React 19, TypeScript y Tailwind CSS. Incluye gestión de eventos, salas, inscripciones y pagos con Mercado Pago.

## Instalación y Ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir [http://localhost:3001](http://localhost:3001) en el navegador

## Estructura del Proyecto

```
app/
├── auth/               # Página de login/registro
├── eventos/            # Gestión de eventos
│   ├── crear/         # Crear evento (organizadores/admins)
│   └── [id]/          # Detalles de evento
├── salas/             # Gestión de salas (solo admins)
├── perfil/            # Perfil del usuario
├── usuarios/          # Lista de usuarios (solo admins)
├── inscripciones/     # Lista de inscripciones (solo admins)
└── page.tsx           # Página principal

components/
└── Header.tsx         # Barra de navegación

contexts/
└── AuthContext.tsx    # Contexto de autenticación

lib/
├── api.ts             # Cliente API
├── types.ts           # Tipos TypeScript
└── services/          # Servicios por módulo
    ├── eventos.service.ts
    ├── inscripciones.service.ts
    ├── salas.service.ts
    └── usuarios.service.ts
```

## Rutas de la Aplicación

### Públicas

- `/` - Página principal con salas disponibles
- `/auth` - Login y registro

### Autenticadas (Todos los roles)

- `/eventos` - Lista de eventos
- `/eventos/[id]` - Detalles de evento
- `/perfil` - Perfil del usuario

### Organizadores y Administradores

- `/eventos/crear` - Crear nuevo evento

### Solo Administradores

- `/salas` - Gestión de salas (CRUD)
- `/usuarios` - Lista de todos los usuarios
- `/inscripciones` - Lista de todas las inscripciones

## Roles y Funcionalidades

### Asistente

- Ver eventos públicos
- Inscribirse a eventos
- Pagar con Mercado Pago
- Ver sus inscripciones

### Organizador

- Todo lo de Asistente
- Crear, editar y eliminar eventos propios
- Seleccionar sala al crear evento
- Ver tabs "Mis Eventos" / "Todos los Eventos"

### Administrador

- Todo lo de Organizador
- Gestionar salas (crear, editar, eliminar)
- Ver todos los usuarios del sistema
- Ver todas las inscripciones
- Acceso a estadísticas completas

## Características Principales

### Sistema de Autenticación

- JWT almacenado en localStorage
- Context API para estado global
- Verificación de roles con `hasRole()`
- Rutas protegidas por rol

### Gestión de Eventos

- Modales dinámicos para editar/eliminar
- Filtrado por organizador
- Visualización de cupos disponibles
- Información de sala incluida

### Sistema de Pagos

- Integración con Mercado Pago
- Checkout en sandbox
- Persistencia de estado de pago
- Botón de pago solo para eventos con precio

### Gestión de Salas

- CRUD completo (solo admins)
- Modal de detalles (todos los usuarios)
- Botón "Reservar Ahora" (organizadores/admins)
- Pre-selección de sala al crear evento
- Validación de eliminación (no permite eliminar si está en uso)

### Administración

- Vista de todos los usuarios con roles
- Vista de todas las inscripciones con nombres reales
- Estadísticas de pagos (pagadas/pendientes)
- Menú desplegable con opciones admin

## Tecnologías

- **Next.js 16.0.0** - Framework React con App Router
- **React 19.2.0** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconos
- **Mercado Pago SDK** - Pasarela de pagos

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Usuarios de Prueba

| Email              | Password | Rol           |
| ------------------ | -------- | ------------- |
| juan@example.com   | 123456   | Administrador |
| ana@example.com    | 123456   | Organizador   |
| carlos@example.com | 123456   | Organizador   |
| maria@example.com  | 123456   | Asistente     |

## Notas de Desarrollo

- Puerto por defecto: `3001`
- API Backend: `http://localhost:3000/api`
- Token JWT se guarda en `localStorage`
- Suspense boundaries para `useSearchParams()`
- Manejo de errores con try-catch
- Loading states en todas las peticiones

## Licencia

MIT
