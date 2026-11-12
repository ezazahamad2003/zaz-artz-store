#!/usr/bin/env bash
# Build Next.js locally, install Linux production dependencies into a bundle
# (built OUTSIDE OneDrive, in the system temp dir, to avoid sync slowness),
# and zip-deploy the self-contained bundle to Azure App Service.
#   bash scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

APP="${APP_NAME:-zaz-artz}"
RG="${RESOURCE_GROUP:-zaz-artz}"
BUNDLE="${BUNDLE_DIR:-${TEMP:-/tmp}/zaz-deploy}"
ZIP="${BUNDLE}.zip"

echo "▶ typecheck + lint"
npx tsc --noEmit
npx eslint src

echo "▶ building"
npx next build

echo "▶ assembling bundle in $BUNDLE"
rm -rf "$BUNDLE" "$ZIP" && mkdir -p "$BUNDLE/.next"
cp -r .next/static "$BUNDLE/.next/static"
cp -r .next/server "$BUNDLE/.next/server"
cp .next/*.json .next/BUILD_ID "$BUNDLE/.next/" 2>/dev/null || true
cp -r public "$BUNDLE/public"
cp next.config.ts package-lock.json "$BUNDLE/"
node -e '
  const p = require("./package.json");
  delete p.scripts.build; delete p.devDependencies;
  p.scripts.start = "next start";
  require("fs").writeFileSync(process.argv[1] + "/package.json", JSON.stringify(p, null, 2));
' "$BUNDLE"

echo "▶ installing linux-x64 production dependencies"
( cd "$BUNDLE" && npm ci --omit=dev --os=linux --cpu=x64 --ignore-scripts --no-audit --no-fund --loglevel=error )

echo "▶ pruning musl/wasm binaries not needed on App Service"
rm -rf "$BUNDLE"/node_modules/@next/swc-linux-x64-musl "$BUNDLE"/node_modules/@img/sharp-linuxmusl-x64 "$BUNDLE"/node_modules/@img/sharp-libvips-linuxmusl-x64 "$BUNDLE"/node_modules/@img/sharp-wasm32

echo "▶ zipping"
# Windows bsdtar writes real zip files; Git Bash GNU tar does not.
TAR=/c/Windows/System32/tar.exe; [ -x "$TAR" ] || TAR=tar
( cd "$BUNDLE" && "$TAR" -a -cf "$(cygpath -w "$ZIP" 2>/dev/null || echo "$ZIP")" . )
ls -la "$ZIP" | awk '{print $5" bytes"}'

echo "▶ deploying to $APP"
az webapp deploy -n "$APP" -g "$RG" --src-path "$ZIP" --type zip --clean true --restart true --timeout 1200 -o none
echo "✓ deployed: https://$(az webapp show -n "$APP" -g "$RG" --query defaultHostName -o tsv)"
