#!/bin/bash
set -euo pipefail
export PATH=/usr/local/bin:/usr/bin:/bin
export BUN_INSTALL_CACHE_DIR=/srv/subdivo/.bun-cache
exec 9>/srv/subdivo/deploy.lock
flock -n 9 || exit 0
cd /srv/subdivo/source
git fetch --quiet origin main
revision=$(git rev-parse FETCH_HEAD)
if [[ -f /srv/subdivo/current/revision.txt ]] && [[ $(cat /srv/subdivo/current/revision.txt) == "$revision" ]]; then
  exit 0
fi
git checkout --quiet --detach "$revision"
bun install --frozen-lockfile
bun test
bun run --bun build
release="/srv/subdivo/releases/$(date -u +%Y%m%dT%H%M%S)-${revision:0:12}"
mkdir -p "$release"
cp -a dist/. "$release/"
printf '%s\n' "$revision" > "$release/revision.txt"
chmod -R a+rX "$release"
ln -s "$release" /srv/subdivo/current.next
mv -Tf /srv/subdivo/current.next /srv/subdivo/current
# Keep the current release and two previous versions for recovery.
find /srv/subdivo/releases -mindepth 1 -maxdepth 1 -type d | sort -r | tail -n +4 | xargs -r rm -rf --
echo "Published $revision"
