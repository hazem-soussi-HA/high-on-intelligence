# Aethric — Staying up "somewhere, anywhere" (architecture)

## Current live state (2026-11-14)
- **Origin A (live): GitHub Pages** → https://hazem-soussi-ha.github.io/high-on-intelligence/
  Global CDN, TLS trusted, auto from this repo. Push to main → redeploys in ~1 min. Branch protection requires the `security` check (strict, admins enforced, linear history, no force-push/delete).
- **Origin B (live, self-hosted, LAN-only): sovereign mirror** — an unprivileged Debian container serving this repo straight from git, HTTPS via a private CA, HTTP→HTTPS redirect. **No SSH daemon on it at all** — shell access only from the hypervisor. Firewall: ICMP dropped, LAN-only TCP 80/443 accepted, everything else dropped. Sync: git pull every 5 minutes. Retired: the old python http.server origin.
- Topology: the mirror sits inside the LAN and answers to the LAN. Nothing is exposed inbound from the internet; the Pages CDN remains the only public face.

## Recommended sovereign topology
```
                      ┌─────────────────────────────┐
 visitors ──DNS──▶    │  Cloudflare (orange cloud)  │  routing + WAF + DDoS + free Universal SSL
                      └───────┬─────────────┬───────┘
                              │             │
              ┌───────────────▼──┐   ┌──────▼───────────┐   ┌──────────────────┐
              │  GitHub Pages     │   │  LXC (sovereign)│   │  Remote VPS/node  │
              │  (CDN origin)     │   │  ✓ provisioned  │   │  second LXC       │
              └───────────────────┘   │  Caddy·LAN-only │   └──────────────────┘
                                      └──────────────────┘
   "if the current infrastructure is down, the service stays up somewhere else"
```

## DNS recipe (once a domain is chosen, e.g. pof.example.com)
1. Cloudflare account → add domain → point registrar NS at Cloudflare nameservers.
2. Records:
   - `CNAME pof → hazem-soussi-ha.github.io` (or A record to LXC public IP)
   - Keep **both** origins behind Cloudflare in **Load Balancing** (paid) or use **health-check-based failover** on free tier via 2 A records + `@` rotation, accepting round-robin behavior.
   - Simpler and free: pof.example.com → GitHub Pages (CNAME), while `origin.example.com` → LXC; Cloudflare handles ingress, Pages is the resilient target.
3. Enable Full (strict) SSL + Always HTTPS + WAF managed rules ("secure ethical power" without harming anyone: WAF protects, never attacks).

## Synchronization model (simple)
- GitHub repo = single source of truth.
- LXC pulls on a cron (every 5 min) or on webhook:
  `*/5 * * * * cd /var/www/hoi.hazem && git pull --ff-only -q && systemctl reload caddy`
- Or GitHub Actions workflow that SSHes into the LXC on push (after you delegate a key).

## What only you can provide (nothing here fakes it)
1. A domain name you own + DNS access (or Cloudflare account).
2. SSH target(s) for the mirror (LAN only), remote VPS(es) for a second origin, their keys/IPs.
3. Approval to flip the CNAME from registrar to the new target.

With those three, the Aethric kit executes in one session.
