const data = { username: 'newuser', password: 'newpass123', role: 'vendor', display_name: 'New Vendor' };

async function run() {
  try {
    const res = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    try { console.log('Body:', JSON.parse(text)); } catch(e) { console.log('Body (raw):', text); }
  } catch (e) {
    console.error('Request failed', e);
  }
}

run();
