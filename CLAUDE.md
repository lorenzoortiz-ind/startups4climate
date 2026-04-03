# CLAUDE.md — Startups4Climate

## Proyecto

Startups4Climate (S4C) es una plataforma all-in-one para founders de startups de impacto en Latinoamérica. Desarrollada por Redesign Lab (Lorenzo Ortiz + Eddie Ajalcriña). Ofrece herramientas interactivas, mentores AI, diagnóstico de startup readiness, y visibilidad de oportunidades (grants, fondos, competencias).

Dos tipos de usuario:
- Founders: acceso gratuito a herramientas y diagnóstico
- Organizaciones: incubadoras, gobiernos, programas de innovación (modelo B2B)

## Stack

- Framework: Next.js 15 (App Router)
- Estilos: Tailwind CSS v4
- Base de datos + Auth: Supabase
- Email: Resend
- Iconos: lucide-react
- Lenguaje: TypeScript
- Deploy: Vercel
- Repo: github.com/lorenzoortiz-ind/startups4climate

## Estructura de páginas

- `/` — Landing principal con hero, diagnóstico, plataforma, about, alianzas
- `/workbook` — Workbook interactivo para founders
- `/organizaciones` — Landing B2B para incubadoras y gobiernos
- `/tools` — Plataforma de herramientas (requiere auth)
- `/admin` — Panel de administración (acceso restringido)

## Convenciones

- Componentes en `/components`, organizados por sección o feature
- Páginas en `/app` siguiendo App Router de Next.js 15
- Variables de entorno en `.env.local` (nunca commitear)
- Nombres de archivos: kebab-case para páginas y componentes
- Clases Tailwind directamente en JSX, sin CSS externo salvo globals.css
- Imágenes en `/public`

## Variables de entorno requeridas

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
```

## Supabase

- Auth habilitado (email/password)
- [COMPLETAR: tablas principales del schema]
- [COMPLETAR: políticas RLS relevantes]

## Identidad visual

- Producto de Redesign Lab
- Tono: directo, sin burocracia, orientado a founders LATAM
- Idioma: español (es-419 latinoamericano)
- No usar anglicismos innecesarios en copy

## Lo que NO debes hacer

- No cambiar la estructura de navegación sin confirmación
- No modificar `/admin` sin instrucción explícita
- No usar `any` en TypeScript
- No instalar dependencias nuevas sin preguntar primero
- No commitear archivos `.env`

## Contacto y contexto

- Email: hello@redesignlab.org
- WhatsApp soporte: +51989338401
- Web Redesign Lab: redesignlab.org
