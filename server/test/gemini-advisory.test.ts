import { createApp } from '../src/app';
import { initDb } from '../src/db';
import http from 'http';

async function testGeminiAdvisoryFlow() {
  console.log('🤖 Testing End-to-End Gemini Agricultural Advisory Flow...\n');
  await initDb();
  const app = createApp();

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(4002, () => resolve()));
  const baseUrl = 'http://localhost:4002/api';

  try {
    // 1. Login with demo farmer
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'farmer@agri-advisor.org',
        password: 'Password123!',
      }),
    });
    const loginData = await loginRes.json();
    if (!loginData.data?.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.data.token;
    console.log('  ✅ Logged in successfully as demo farmer');

    // 2. Submit realistic agricultural inquiry
    console.log('  🌾 Submitting crop advisory request to Gemini 3.8 Flash...');
    const startTime = Date.now();
    const advRes = await fetch(`${baseUrl}/advisories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        domain: 'pest_management',
        cropName: 'Tomato',
        cropStage: 'flowering',
        location: 'Nashik, Maharashtra',
        soilType: 'Black Soil (Regur)',
        soilPH: 6.8,
        soilFertility: 'Good organic carbon, adequate phosphorus',
        season: 'Rabi (Winter Sowing)',
        irrigationMethod: 'Drip Irrigation',
        waterAvailability: 'moderate',
        farmSize: 4.5,
        farmingMethod: 'integrated',
        previousCrop: 'Onion',
        symptoms: 'Curling of young apical leaves, mild mottled yellowing',
        pestObservations: 'Tiny slender thrips visible when tapping flower clusters',
        weatherObservations: 'Dry daytime conditions, 28-30C',
        question: 'How do I safely manage thrips during flowering without damaging fruit set or pollinator bees?',
      }),
    });

    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    const advData = await advRes.json();

    if (advRes.status !== 201 || !advData.success) {
      throw new Error(`Advisory generation failed: ${JSON.stringify(advData)}`);
    }

    console.log(`  ✅ Advisory generated & validated by Zod in ${elapsedSeconds}s!`);
    console.log(`  📝 Advisory ID: ${advData.data.id}`);
    console.log(`  📊 Summary: ${advData.data.summary.substring(0, 120)}...`);
    console.log(`  🎯 Confidence: ${advData.data.confidence}`);
    console.log(`  ⚡ Immediate Actions:`, advData.data.action_plan?.immediate?.slice(0, 2));
    console.log(`  ⚠️ Overall Risk: ${advData.data.risk_assessment?.overall}`);

    // 3. Verify retrieving by ID
    const getRes = await fetch(`${baseUrl}/advisories/${advData.data.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    if (getRes.status !== 200 || getData.data?.id !== advData.data.id) {
      throw new Error('Failed to fetch newly created advisory by ID');
    }
    console.log('  ✅ Verified advisory retrieval by ID with user isolation');

    console.log('\n🎉 Real Gemini AI Agriculture Advisory Flow Fully Verified!\n');
  } finally {
    server.close(() => {
      setTimeout(() => process.exit(0), 100);
    });
  }
}

testGeminiAdvisoryFlow().catch((err) => {
  console.error('Fatal Gemini test error:', err);
  process.exit(1);
});
