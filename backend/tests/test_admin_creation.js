const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING ADMIN CREATION TESTS ---');

  // 1. Attempt to create an admin without login (should fail with 401/403)
  try {
    console.log('\n[Test 1] Creating admin without token...');
    const res = await fetch(`${API_URL}/admin/users/create-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Admin',
        email: 'newadmin@example.com',
        password: 'password123'
      })
    });
    if (res.ok) {
        console.log('FAIL: Created admin without token!');
    } else {
        console.log(`SUCCESS: Failed as expected (${res.status} ${res.statusText})`);
    }
  } catch (err) {
    console.log(`ERROR in Test 1: ${err.message}`);
  }

  // 2. Register a regular user and attempt to create an admin (should fail with 403)
  try {
    console.log('\n[Test 2] Creating admin as a regular user...');
    
    // Register a regular user
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Regular User',
        email: `user${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    const token = regData.token;

    // Try to create admin
    const res = await fetch(`${API_URL}/admin/users/create-admin`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        name: 'Unauthorized Admin',
        email: 'unauthorized@example.com',
        password: 'password123'
      })
    });
    
    if (res.ok) {
        console.log('FAIL: Regular user created an admin!');
    } else {
        const data = await res.json();
        console.log(`SUCCESS: Failed as expected (${res.status} ${res.statusText}) - ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log(`ERROR in Test 2: ${err.message}`);
  }

  // 3. Admin creation (Manual check needed or use an existing admin account)
  console.log('\n[Test 3] Admin creation requires an existing admin account.');
  console.log('Please verify manually with an existing admin token if possible.');
  
  console.log('\n--- TESTS COMPLETED ---');
}

runTests();
