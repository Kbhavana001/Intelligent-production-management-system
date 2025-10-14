const base = 'http://localhost:4000';

function rnd() { return Math.random().toString(36).slice(2,8); }
const username = `test_${rnd()}`;
const password = 'P@ssw0rd';

async function post(path, data) {
  const res = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  let body = text;
  try { body = JSON.parse(text); } catch (e) {}
  return { status: res.status, body, headers: Object.fromEntries(res.headers.entries()) };
}

(async ()=>{
  console.log('Signup ->', username);
  const s = await post('/api/auth/signup', { username, password, role: 'vendor', display_name: 'E2E Tester' });
  console.log('Signup status:', s.status);
  console.log('Signup body:', s.body);
  console.log('Signup headers:', s.headers);

  console.log('\nLogin ->', username);
  const l = await post('/api/auth/login', { username, password });
  console.log('Login status:', l.status);
  console.log('Login body:', l.body);
  console.log('Login headers:', l.headers);
})();
