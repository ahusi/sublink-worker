// Render app/wrangler.prod.toml from the upstream wrangler.toml.
// Keeps upstream settings but forces our KV namespace id and custom-domain route.
// Top-level TOML keys must precede the first [table], otherwise `routes` would
// be parsed as assets.routes and silently ignored.
import fs from 'node:fs';
import path from 'node:path';

const appDir = process.argv[2] || 'app';
const tomlPath = path.join(appDir, 'wrangler.toml');
const KV_ID = '2b3d298ae968453baaf1b526443b517d';
const ROUTE = 'sub.566266.xyz';

const src = fs.readFileSync(tomlPath, 'utf8');

const kvRe = /(kv_namespaces\s*=\s*\[\s*\{[^}]*?\bid\s*=\s*")[^"]*(")/s;
if (!kvRe.test(src)) throw new Error('no kv_namespaces binding with an id found in wrangler.toml');
let out = src.replace(kvRe, (_m, a, b) => a + KV_ID + b);

if (/^routes\s*=/m.test(out)) throw new Error('upstream wrangler.toml now has a routes block; merge manually');

const lines = out.split('\n');
let idx = lines.findIndex((line) => line.trimStart().startsWith('['));
if (idx === -1) idx = lines.length;
lines.splice(idx, 0, '', 'workers_dev = false', '', 'routes = [', `  { pattern = "${ROUTE}", custom_domain = true }`, ']');

fs.writeFileSync(path.join(appDir, 'wrangler.prod.toml'), lines.join('\n') + '\n');
console.log('wrote', path.join(appDir, 'wrangler.prod.toml'));
