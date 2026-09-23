const { Client } = require('pg');

const connectionString = 'postgresql://postgres:vHxxPrznNFZCVBy9@db.wfccdwzreyspzewrzjjy.supabase.co:5432/postgres';

async function checkDb() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Connected to database successfully.");
    
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    if (res.rows.length === 0) {
      console.log("Database is empty (no tables in public schema).");
    } else {
      console.log("Tables found:", res.rows.map(r => r.table_name));
    }
  } catch (err) {
    console.error("Database connection error:", err);
  } finally {
    await client.end();
  }
}

checkDb();
