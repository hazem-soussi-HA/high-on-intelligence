# Aethric — Certificates: Own CA vs Public CA (the honest guide)

## The split in one sentence
Public internet → **Let's Encrypt / paid CA** (free, trusted by every browser).
Inside Proxmox & the LAN → **your own Aethric private CA** (correct tool for internal services).

## Why you do NOT publish a self-signed cert to the internet
Browsers mark self-signed certs as errors — users see "Not Secure", and "legitimacy policy" means nothing behind a red wall. Public legitimacy = trusted chain + published policy + reachable contact.

## A. Let's Encrypt on the LXC (public) — one command
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d hoi.hazem.example.com
```
Caddy variant (manages renewal itself, zero cron):
```
hoi.hazem.example.com { root * /var/www/hoi.hazem; file_server; encode zstd gzip; }
```

## B. Aethric private CA (LAN / Proxmox only)
Create once on a safe machine (or the Proxmox host), store the CA key encrypted offline:
```bash
mkdir -p aethric-ca && cd aethric-ca
# Root CA (10y)
openssl genrsa -out aethric-root-ca.key 4096
openssl req -x509 -new -nodes -key aethric-root-ca.key -sha256 -days 3650 \
  -subj "/C=TN/O=Aethric/OU=Private CA/CN=Aethric Root CA" -out aethric-root-ca.crt
# Per-service cert (LAN)
openssl genrsa -out hoi-lan.key 2048
openssl req -new -key hoi-lan.key -subj "/C=TN/O=Aethric/CN=hoi.lan" -out hoi-lan.csr
openssl x509 -req -in hoi-lan.csr -CA aethric-root-ca.crt -CAkey aethric-root-ca.key \
  -CAcreateserial -days 825 -sha256 -extensions v3 -extfile <(printf "[v3]\nsubjectAltName=DNS:hoi.lan,DNS:hoi.internal.lan") -out hoi-lan.crt
```
Import `aethric-root-ca.crt` into your LAN devices/browsers ("Trusted Root CAs"). Never import a CA key that will ever travel to the internet.

## C. Cloudflare alternative (if you use Cloudflare DNS for our domains)
- Free plan gives automatic Universal SSL = legitimacy without any cert work.
- DNS-only (grey cloud) works with the LXC + Let's Encrypt.
- Proxied (orange cloud) adds WAF/DDoS = extra "secure ethical power", and works with Full (strict) SSL mode against the LXC origin.
