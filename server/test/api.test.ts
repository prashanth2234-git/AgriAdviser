import { createApp } from '../src/app';
import { initDb } from '../src/db';
import http from 'http';

async function runTests() {
  console.log('🧪 Starting Backend API Automated Tests...\n');
  await initDb();
  const app = createApp();

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(4001, () => resolve()));
  const baseUrl = 'http://localhost:4001/api';

  try {
    let passed = 0;
    let failed = 0;

    const assert = (condition: boolean, desc: string) => {
      if (condition) {
        console.log(`  ✅ PASS: ${desc}`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: ${desc}`);
        failed++;
      }
    };

    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

    // 2. Unauthorized access check
    const unauthRes = await fetch(`${baseUrl}/advisories`);
    const unauthData = await unauthRes.json();
    assert(unauthRes.status === 401 && unauthData.error?.code === 'UNAUTHORIZED', 'GET /api/advisories without token is rejected with 401');

    // 3. User Registration
    const testEmail1 = `farmer1_${Date.now()}@agri-test.org`;
    const regRes1 = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        password: 'Password123!',
        fullName: 'Test Farmer One',
        location: 'Karnal, Haryana',
        preferredLanguage: 'en',
      }),
    });
    const regData1 = await regRes1.json();
    assert(regRes1.status === 201 && regData1.data?.token, 'POST /api/auth/register creates user and returns JWT');
    const token1 = regData1.data.token;
    const user1Id = regData1.data.user.id;

    // 4. Duplicate Registration rejection
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        password: 'Password123!',
        fullName: 'Test Farmer Duplicate',
      }),
    });
    assert(dupRes.status === 409, 'POST /api/auth/register rejects duplicate email with 409 Conflict');

    // 5. User Login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        password: 'Password123!',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.data?.token, 'POST /api/auth/login authenticates and returns JWT');

    // 6. Current User Me
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.data?.user?.email === testEmail1, 'GET /api/auth/me returns authenticated user details');

    // 7. Profile & Preferences Update
    const prefRes = await fetch(`${baseUrl}/preferences`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const prefData = await prefRes.json();
    assert(prefRes.status === 200 && prefData.data?.notifications_enabled === true, 'GET /api/preferences returns user preferences');

    const updatePrefRes = await fetch(`${baseUrl}/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        emailNotifications: true,
      }),
    });
    const updatePrefData = await updatePrefRes.json();
    assert(updatePrefRes.status === 200 && updatePrefData.data?.email_notifications === true, 'PATCH /api/preferences updates preferences');

    // 8. User Isolation Test
    // Create second user
    const testEmail2 = `farmer2_${Date.now()}@agri-test.org`;
    const regRes2 = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail2,
        password: 'Password123!',
        fullName: 'Test Farmer Two',
      }),
    });
    const regData2 = await regRes2.json();
    const token2 = regData2.data.token;

    // Check that user2 gets empty or isolated advisory list
    const advList2Res = await fetch(`${baseUrl}/advisories`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    const advList2Data = await advList2Res.json();
    assert(
      advList2Res.status === 200 && Array.isArray(advList2Data.data) && advList2Data.data.length === 0,
      'User 2 cannot see User 1 advisories (strict user isolation enforced)'
    );

    // 9. Dashboard summary endpoint
    const dashRes = await fetch(`${baseUrl}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const dashData = await dashRes.json();
    assert(dashRes.status === 200 && typeof dashData.data?.totalAdvisories === 'number', 'GET /api/dashboard/summary returns structured metrics');

    console.log(`\nResults: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
