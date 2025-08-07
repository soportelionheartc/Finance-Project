import { execSync } from 'child_process';
import pg from 'pg';
import fs from 'fs';
import { drizzle } from 'drizzle-orm/pg-core';

const { Pool } = pg;

// Create pool connection using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('Connecting to database...');
  
  try {
    // Read the schema file directly to avoid interactive mode
    console.log('Executing direct SQL migration...');
    
    const connection = await pool.connect();
    
    // Verificar si la columna profile_picture existe en la tabla users
    const checkColumnResult = await connection.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'profile_picture'
    `);
    
    if (checkColumnResult.rows.length === 0) {
      console.log('Adding missing column profile_picture to users table...');
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS profile_picture TEXT
      `);
    } else {
      console.log('Column profile_picture already exists');
    }
    
    // Verificar si existen otras tablas requeridas
    const tables = ['auth_providers', 'wallets', 'portfolios', 'assets', 'strategies', 
                   'chat_history', 'decentralized_messages'];
    
    for (const table of tables) {
      const tableCheckResult = await connection.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = $1
      `, [table]);
      
      if (tableCheckResult.rows.length === 0) {
        console.log(`Creating missing table ${table}...`);
        
        // Schema implementation through direct SQL for each table
        if (table === 'auth_providers') {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS auth_providers (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id),
              provider TEXT NOT NULL,
              provider_id TEXT NOT NULL,
              provider_data JSONB,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `);
        } else if (table === 'wallets') {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS wallets (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id),
              type TEXT NOT NULL,
              address TEXT NOT NULL,
              label TEXT,
              public_key TEXT,
              balance REAL DEFAULT 0,
              network TEXT,
              is_connected BOOLEAN DEFAULT FALSE,
              is_default BOOLEAN DEFAULT FALSE,
              last_synced TIMESTAMP,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `);
        } else if (table === 'portfolios') {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS portfolios (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id),
              name TEXT NOT NULL,
              total_value REAL NOT NULL DEFAULT 0,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `);
        } else if (table === 'assets') {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS assets (
              id SERIAL PRIMARY KEY,
              portfolio_id INTEGER NOT NULL REFERENCES portfolios(id),
              name TEXT NOT NULL,
              symbol TEXT NOT NULL,
              type TEXT NOT NULL,
              quantity REAL NOT NULL,
              price REAL NOT NULL,
              value REAL NOT NULL,
              change24h REAL,
              icon TEXT,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `);
        } else if (table === 'strategies') {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS strategies (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id),
              name TEXT NOT NULL,
              description TEXT,
              parameters JSONB,
              active BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `);
        } else if (table === 'chat_history') {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS chat_history (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id),
              message TEXT NOT NULL,
              response TEXT NOT NULL,
              timestamp TIMESTAMP DEFAULT NOW()
            )
          `);
        } else if (table === 'decentralized_messages') {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS decentralized_messages (
              id SERIAL PRIMARY KEY,
              wallet_id INTEGER REFERENCES wallets(id),
              sender_address TEXT NOT NULL,
              content TEXT NOT NULL,
              topic TEXT,
              timestamp TIMESTAMP DEFAULT NOW(),
              transaction_hash TEXT,
              chain_id TEXT NOT NULL,
              is_encrypted BOOLEAN DEFAULT FALSE
            )
          `);
        }
      } else {
        console.log(`Table ${table} already exists`);
      }
    }
    
    console.log('Database migration completed successfully!');
    connection.release();
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();