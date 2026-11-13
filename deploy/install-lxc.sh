# Aethric — containerized sovereign deployment (Proxmox LXC)
# Run INSIDE a fresh Debian 12 LXC (unprivileged, 512MB+ RAM, 2GB disk, network: static LAN IP or DHCP reservation)

set -euo pipefail
SITE_DIR=/var/www/pof.hazem

apt-get update
apt-get install -y curl gnupg2 lsb-release ca-certificates git

# --- Caddy (auto-HTTPS via Let's Encrypt) ---
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/debian any-version main" > /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install -y caddy openssl

# --- Site files ---
mkdir -p "$SITE_DIR"
if [ ! -d "$SITE_DIR/.git" ]; then
  git clone https://github.com/hazem-soussi-HA/pof-thinking-machine.git "$SITE_DIR"
fi

# --- Caddy config (public) ---
# Public hostname -> automatic public cert. Internal -> use local CA, see certs.md
cat > /etc/caddy/Caddyfile <<'EOF'
pof.hazem.example.com {
    root * /var/www/pof.hazem
    encode zstd gzip
    file_server
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options SAMEORIGIN
        Referrer-Policy strict-origin-when-cross-origin
        Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'"
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
    }
}
EOF
# Replace pof.hazem.example.com with YOUR domain before reloading:
#   sed -i 's/pof.hazem.example.com/YOURDOMAIN/g' /etc/caddy/Caddyfile

systemctl enable --now caddy
systemctl reload caddy
echo "Aethric LXC ready. Open http://<lxc-ip>:8098 locally or https://YOURDOMAIN publicly."
