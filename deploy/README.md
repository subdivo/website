# VPS deployment

The public site is https://subdivo.xyz. Caddy serves static files and renews HTTPS
certificates automatically through ZeroSSL ACME. Let's Encrypt's endpoint is
unreachable from this VPS. `www` redirects to the primary domain.

`subdivo-update.timer` checks the public GitHub repository
https://github.com/subdivo/website, branch `main`, every minute. A change triggers
dependency installation with the committed lockfile, journal tests, and a build.
Only successful builds replace `/srv/subdivo/current` atomically. Two previous
releases are retained. No GitHub token or root SSH access is needed for publishing.

Server layout:

- `/srv/subdivo/source`: Git checkout, owned by the dedicated `subdivo` user.
- `/srv/subdivo/releases`: built releases.
- `/srv/subdivo/current`: symlink to the active release.
- `/usr/local/bin/subdivo-update`: installed copy of `update-site.sh`.
- `/etc/systemd/system/subdivo-update.{service,timer}`: update units.
- `/etc/caddy/Caddyfile`: installed Caddy configuration.
- `/etc/caddy/subdivo-acme.env`: private ACME email and ZeroSSL EAB credentials,
  root-owned with mode 600, loaded by `caddy.service.d/acme.conf`.

`caddy-acme.conf` is installed as `/etc/systemd/system/caddy.service.d/acme.conf`.
The environment file supplies `ACME_EMAIL`, `ZEROSSL_EAB_KID`, and
`ZEROSSL_EAB_HMAC_KEY`; credentials must never be committed. Caddy retains the ACME
account and automatically renews certificates without calling ZeroSSL's EAB API.

The server uses Bun 1.4.2, Git and Caddy. Install the deployment files as root;
the build service itself runs as `subdivo`. Changes to files in `deploy/` must be
installed explicitly by the server administrator; application updates are automatic.

```sh
systemctl start subdivo-update.service
systemctl status subdivo-update.timer
journalctl -u subdivo-update.service -n 60 --no-pager
cat /srv/subdivo/current/revision.txt
```

See [WRITING.md](../WRITING.md) for publishing notes directly through GitHub.
