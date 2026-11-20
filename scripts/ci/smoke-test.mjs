// Post-deploy smoke test against the live custom domain.
const BASE = 'https://sub.566266.xyz';
const UA = 'clash-verge/v2.0.0';

const vmess = {
  v: '2',
  ps: 'AutoSmoke',
  add: '1.2.3.4',
  port: '443',
  id: 'b831381d-6324-4d53-ad4f-8cda48b30811',
  aid: '0',
  scy: 'auto',
  net: 'ws',
  type: 'none',
  host: 'a.example.com',
  path: '/ws',
  tls: 'tls',
  sni: 'a.example.com',
};

const link = 'vmess://' + Buffer.from(JSON.stringify(vmess)).toString('base64');
const sub = Buffer.from(link).toString('base64');

const res = await fetch(`${BASE}/clash?${new URLSearchParams({ config: sub })}`, {
  headers: { 'User-Agent': UA },
});
const body = await res.text();

if (res.status !== 200 || !body.includes('AutoSmoke')) {
  console.error(`smoke test failed: HTTP ${res.status}`);
  console.error(body.slice(0, 500));
  process.exit(1);
}
console.log('smoke ok');
