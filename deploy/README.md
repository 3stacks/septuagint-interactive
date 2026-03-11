# Homeserver Deployment

See [power-monitor/deploy/README.md](../../power-monitor/deploy/README.md) for the full unified deployment pattern.

## Quick Reference

**Registry image:** `registry.home.lukeboyle.com/septuagint-interactive`
**Default port:** 3000

### Deploy

```bash
# After pushing to main branch:
cd ~/septuagint-interactive
docker compose pull
docker compose up -d
```

### Files on homeserver (`~/septuagint-interactive/`)

- `docker-compose.yml` - from `deploy/docker-compose.yml`
- `.env` - from `deploy/.env.example`
