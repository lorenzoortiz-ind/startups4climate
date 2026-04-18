# Estrategia de Backups — S4C

## Estado actual

- **Plan Supabase**: Free tier
- **Backups automáticos**: 1 snapshot diario retenido por 7 días (incluido en Free)
- **PITR (Point-in-Time Recovery)**: NO disponible en Free, requiere Pro ($25/mo)

Hasta que se haga el upgrade, mantenemos un dump manual semanal en local + un snapshot mensual archivado en almacenamiento externo (Drive/S3) como red de seguridad.

## Backup semanal manual (mientras estamos en Free)

### Requisitos
- `psql` 17+ (`brew install postgresql@17`)
- Connection string del proyecto: ir a Supabase → Project Settings → Database → "Connection string" en modo **Session pooler** (puerto 5432, no el transaction pooler de 6543)

### Comando

```bash
# 1. Cargar la connection string como env var (no la commits)
export S4C_DB_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"

# 2. Dump completo (schema + data) con gzip
DATE=$(date +%Y%m%d-%H%M)
pg_dump --no-owner --no-acl --clean --if-exists "$S4C_DB_URL" | gzip > "s4c-backup-${DATE}.sql.gz"

# 3. Verifica el tamaño (debería ser >100KB)
ls -lh s4c-backup-${DATE}.sql.gz
```

### Restaurar (smoke test mensual sobre branch staging)

```bash
gunzip -c s4c-backup-YYYYMMDD-HHMM.sql.gz | psql "$STAGING_DB_URL"
```

> **Recomendación**: hacer un restore real al menos 1 vez al mes contra una Supabase branch (sin tocar producción). Si falla, el backup no sirve.

## Plan al hacer upgrade a Pro

Cuando se haga el upgrade (~$25/mo), Supabase activa automáticamente:

1. **Daily backups** retenidos por 7 días (vs 7 también en Free pero con menos garantías)
2. **Point-in-Time Recovery** con granularidad de minutos hasta 7 días atrás
3. **Read replicas** opcionales (para reportes pesados sin tocar la primaria)

Después del upgrade:
- [ ] Activar PITR en Supabase Dashboard → Database → Backups
- [ ] Reducir frecuencia del dump manual a 1 vez por mes (solo como off-site)
- [ ] Configurar un **alert** en Supabase para notificar si el último backup falla

## Datos críticos a respaldar adicionalmente

Aunque el dump cubre todo Postgres, estas tablas son las más sensibles. Si alguna vez hay un incidente, son las que primero hay que verificar:

| Tabla | Por qué es crítica |
|-------|-------------------|
| `profiles` | identidades + roles (sin esto no hay login) |
| `organizations` | configuración B2B (sin esto los admins quedan huérfanos) |
| `cohorts` + `cohort_startups` | relaciones founder ↔ org ↔ programa |
| `tool_data` | progreso de herramientas (data del founder, irreemplazable) |
| `diagnostics` | resultados de scoring (data del founder) |
| `invitations` | tokens activos (deben preservarse para no romper onboarding en curso) |

## Storage buckets

`logos` es público y los archivos no se pueden re-derivar. Hacer copia de los objetos cada cierto tiempo:

```bash
# Listar y descargar (requiere supabase CLI)
supabase storage download --recursive logos ./backup-logos-$(date +%Y%m%d)
```

## Disaster recovery checklist

Si la DB se corrompe o se borra accidentalmente:

1. **NO entrar en pánico ni intentar arreglar la prod** — primero crear un snapshot del estado actual (`pg_dump` aunque esté roto)
2. Identificar el último backup válido (revisar tamaños recientes; un dump <50KB suele estar vacío)
3. Crear un Supabase **branch** y restaurar ahí primero (NUNCA restaurar directo en main)
4. Verificar integridad: `SELECT count(*) FROM profiles, organizations, cohorts, tool_data;`
5. Comparar con la última métrica conocida (Slack/email) para detectar pérdida
6. Si todo OK → promover branch o `psql` directo a main con el dump validado
7. Post-mortem: documentar causa, ventana de pérdida, y cambiar lo que la habilitó

## Checklist mensual (1° de cada mes)

- [ ] Correr `pg_dump` y archivar el `.sql.gz` en almacenamiento externo
- [ ] Restore-test sobre Supabase branch
- [ ] Verificar que el snapshot diario de Supabase aparece en el dashboard
- [ ] Revisar `storage/objects` count y `auth.users` count vs mes anterior (detectar drift)
