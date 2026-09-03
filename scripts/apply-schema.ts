import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { Client } from 'pg';
import * as fs from 'fs';

dotenv.config({ path: resolve(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB.");

    const schemaPath = resolve(__dirname, '../supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log("Executing schema...");
    await client.query(schemaSql);
    console.log("Schema executed successfully.");
  } catch (error) {
    console.error("Error executing schema:", error);
  } finally {
    await client.end();
  }
}

run();
