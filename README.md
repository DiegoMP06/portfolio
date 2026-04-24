# MenesesTech Portfolio

Portfolio profesional de **Diego Meneses Pérez** desarrollado con **Astro.js** y **TailwindCSS**.
Estética **synthwave / retro-futurista** con paleta rojo–morado–azul neón.

Incluye sistema de autenticación, dashboard admin, CRUD de proyectos, editor Tiptap y galería de imágenes.

## 🚀 Stack

- **Framework**: Astro.js 6.x
- **Estilos**: TailwindCSS 4.x (@tailwindcss/vite)
- **UI**: React 19 (componentes interactivos)
- **Editor**: Tiptap (WYSIWYG)
- **DB**: Astro DB (libSQL - local o remote con Turso)
- **Auth**: JWT + bcryptjs
- **Imágenes**: Cloudinary + PhotoSwipe
- **Email**: Nodemailer (Gmail SMTP)
- **Deploy**: Vercel

## 📁 Estructura

```
portfolio-diego-meneses/
├── .astro/              # DB y tipos de Astro
├── db/
│   ├── config.ts       # Configuración de DB
│   └── seed.ts        # Seed de datos iniciales
├── public/             # Assets estáticos
├── src/
│   ├── actions/       # Server actions
│   ├── components/
│   │   ├── auth/     # Componentes de auth
│   │   ├── cloudinary/ # Componentes de Cloudinary
│   │   ├── editor/  # Editor Tiptap
│   │   ├── gallery/  # PhotoSwipe Gallery
│   │   ├── home/    # Componentes públicos
│   │   ├── icons/   # Iconos SVG
│   │   ├── projects/ # Componentes de proyectos
│   │   └── ui/      # Componentes reutilizables
│   ├── consts/      # Constantes
│   ├── layouts/    # Layouts
│   ├── lib/        # Utilidades
│   ├── middleware.ts # Middleware auth
│   ├── pages/      # Rutas
│   ├── styles/     # Estilos globales
│   └── types/      # Tipos TypeScript
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🎨 Paleta de colores

| Token        | Hex       | Uso                        |
|-------------|----------|---------------------------|
| neon-red    | `#ff2d55` | AI, acentos primarios     |
| neon-pink   | `#ff006e` | Gradientes               |
| neon-purple | `#8b5cf6` | Secundario, cards        |
| neon-violet | `#c026d3` | Gradientes intermedios    |
| neon-blue   | `#00d4ff` | Web, info, detalles      |
| neon-cyan   | `#06b6d4` | Gradientes               |
| dark-base   | `#080810` | Fondo principal          |
| dark-surface| `#0d0d1a`| Superficies               |
| dark-card   | `#12121f` | Cards                   |
| dark-border| `#1e1e35`| Bordes sutiles            |
| text-primary| `#e8e8f0`| Texto principal          |
| text-muted  | `#7878a0`| Texto secundario         |

## 🔤 Tipografías

- **Orbitron** — Display/Logo
- **Exo 2** — Headings
- **IBM Plex Sans** — Body
- **IBM Plex Mono** — Código

## ⚡ Inicio rápido

```bash
# Instalar dependencias
pnpm install

# Copiar archivo de entorno y configurar
cp .env.example .env

# Ejecutar seed (crea usuario inicial)
pnpm astro db execute db/seed.ts

# Iniciar servidor dev
pnpm dev
# http://localhost:4321
```

## 🔧 Variables de entorno (.env)

```env
# URLs
SITE_URL=http://localhost:4321
APP_URL=http://localhost:4321
PROD=false

# Database (local)
ASTRO_DATABASE_FILE=.astro/content.db

# Database (remote - Turso)
ASTRO_DB_REMOTE_URL=libsql://tu-database.turso.io
ASTRO_DB_APP_TOKEN=tu_token_aqui

# Contact email
PUBLIC_CONTACT_EMAIL=contacto@tudominio.com
USER_MAIL=contacto@tudominio.com

# Gmail SMTP
GMAIL_USER=tu-correo@gmail.com
GMAIL_APP_PASSWORD=tu-app-password
MAIL_FROM="MenesesTech <tu-correo@gmail.com>"

# Cloudinary
CLOUDINARY_DOMAIN=res.cloudinary.com
PUBLIC_CLOUDINARY_DOMAIN="https://${CLOUDINARY_DOMAIN}"
PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset

# Social links
GITHUB_URL=https://github.com/tu-usuario
LINKEDIN_URL=https://linkedin.com/in/tu-usuario
X_URL=https://twitter.com/tu-usuario
DEV_MAIL=correo@correo.com

# Seed (usuario inicial)
USER_NAME=Tu Nombre
USER_PASS=tu-contraseña
```

## 🌐 Rutas

| Ruta                      | Descripción                    |
|--------------------------|--------------------------------|
| `/`                      | Página principal               |
| `/auth/login`            | Login                          |
| `/auth/register`         | Registro                       |
| `/auth/forgot-password`  | Recuperar contraseña         |
| `/auth/reset-password`  | Reset contraseña               |
| `/projects`             | Lista de proyectos             |
| `/projects/[slug]`      | Detalle de proyecto            |
| `/projects/create`      | Crear proyecto                |
| `/projects/[id]/edit`  | Editar proyecto               |
| `/settings`            | Configuración usuario        |

## 🔐 Autenticación

- JWT en cookies httpOnly (secure en producción)
- bcryptjs para hash de contraseñas
- Rate limiting en login
- Sesión persistida con middleware

## 📦 Scripts

```bash
pnpm dev          # Servidor dev
pnpm build       # Build para producción
pnpm build:local # Build con DB local
pnpm preview     # Preview del build
```

## 🚧 Funcionalidades

- [x] Portfolio público
- [x] Autenticación JWT
- [x] Dashboard admin
- [x] CRUD proyectos
- [x] Editor Tiptap
- [x] Galería Cloudinary
- [x] PhotoSwipe
- [x] SEO (sitemap, robots.txt)
- [x] Rate limiting
- [x] Envío de emails

## 📄 Licencia

MIT