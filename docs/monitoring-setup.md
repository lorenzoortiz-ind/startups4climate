# Monitoring Setup — Startups4Climate

Guía rápida para wire-uppear Sentry + UptimeRobot. Los endpoints del lado del servidor ya existen, sólo falta la configuración externa.

## 1. UptimeRobot (health check)

Endpoint público ya desplegado: **`https://startups4climate.org/api/health`**

Responde 200 si todo OK, 503 si Supabase está caído. Incluye latencia.

**Setup (2 minutos):**
1. Cuenta gratis en https://uptimerobot.com
2. Add New Monitor → tipo **HTTPS**
3. URL: `https://startups4climate.org/api/health`
4. Interval: **5 minutos** (plan gratis permite 50 monitors)
5. Alert contacts: Lorenzo + Eddie (email + WhatsApp opcional)
6. Keyword monitoring (opcional): "status":"ok"

**Monitores recomendados:**
- `/api/health` — salud app + DB
- `/` — landing principal
- `/tools` — plataforma founders (debería responder incluso no-autenticado con redirect)

## 2. Sentry (error tracking)

Requiere instalar `@sentry/nextjs`:

```bash
npx @sentry/wizard@latest -i nextjs
```

El wizard:
1. Crea cuenta / autentica
2. Crea proyecto `startups4climate`
3. Agrega `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
4. Agrega `NEXT_PUBLIC_SENTRY_DSN` a `.env.local` y Vercel

**Después del wizard, ajustes:**

En `sentry.client.config.ts`:
```ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,         // 10 % de transactions
  replaysSessionSampleRate: 0.0, // opcional, requiere plan pago para volumen
  replaysOnErrorSampleRate: 1.0, // siempre grabar sesión cuando hay error
  environment: process.env.NODE_ENV,
  // Filtrar errores de extensiones de navegador
  ignoreErrors: [
    'Non-Error promise rejection',
    'ResizeObserver loop',
    'chrome-extension://',
  ],
})
```

En `sentry.server.config.ts`:
```ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.05,
  environment: process.env.NODE_ENV,
})
```

**Tags útiles a agregar en middleware:**
```ts
Sentry.setUser({ id: user.id, role: profile.role })
Sentry.setTag('org_id', profile.org_id || 'none')
```

**Alert rules recomendadas (en dashboard Sentry):**
- Issue new + frequency > 10 events/hr → Slack/email Lorenzo
- Any error on `/api/ai/*` → inmediato
- Any 5xx on `/api/invitations/*` → inmediato

**Coste:** Plan Developer gratis incluye 5K errores/mes — suficiente para launch.

## 3. CRON_SECRET (ya requerido)

El endpoint `/api/cron/radar-rss` requiere `CRON_SECRET` para que sólo Vercel cron pueda invocarlo.

**Setup:**
```bash
# Generar secret
openssl rand -base64 32
```

Luego en Vercel → Project Settings → Environment Variables:
- `CRON_SECRET` → (el string generado) → Production + Preview
- `SUPABASE_SERVICE_ROLE_KEY` → (de Supabase Dashboard → Settings → API → service_role) → Production + Preview

**Verificar cron activo:** Vercel Dashboard → Project → Settings → Crons → `/api/cron/radar-rss` debe aparecer listado tras el siguiente deploy.

## 4. Supabase point-in-time recovery

Plan Free no incluye PITR automático. Para launch, tomar snapshot manual cada 48h:

```bash
# En máquina local con psql + connection string desde Supabase Dashboard → Settings → Database
pg_dump "postgresql://..." > s4c_backup_$(date +%Y%m%d).sql
```

Al saltar a Pro ($25/mo) se activa PITR de 7 días automáticamente.

## 5. Performance: eliminar redirect apex → www

Lighthouse reportó **1.45 s de latencia** por el redirect `startups4climate.org → www.startups4climate.org`. Esto es el golpe #1 en Performance.

**Fix en Vercel (1 minuto):**
1. Vercel Dashboard → Project → Settings → Domains
2. Identifica cuál está marcado como **Primary**
3. Cambia primary a `startups4climate.org` (apex) o actualiza DNS para que el apex sirva directamente y `www` sea el redirect (no al revés)
4. Alternativa: si prefieres `www` como canónico, actualiza DNS del apex con un A record hacia Vercel en vez de un redirect HTTP

Meta: 0 redirects en la request inicial.

## 6. Performance: code splitting framer-motion

Lighthouse reportó 1.36 s en "unused JavaScript". Probable causa: landing carga `framer-motion` entero aunque sólo se use en secciones below-the-fold.

Opciones:
- Dinamic import de componentes con animaciones complejas
- Reemplazar framer-motion por CSS animations en componentes simples

No bloqueante para launch; target post-MVP.

## 7. Checklist pre-launch

- [ ] UptimeRobot monitor en `/api/health`
- [ ] Sentry wizard ejecutado + DSN en Vercel
- [ ] CRON_SECRET en Vercel
- [ ] SUPABASE_SERVICE_ROLE_KEY en Vercel
- [ ] Primer `pg_dump` local guardado
- [ ] Verificar que `/api/cron/radar-rss` se ejecuta (Vercel Logs tras 10:00 UTC)
