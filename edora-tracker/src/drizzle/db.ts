import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000, // Wait 20s for Neon to wake up
    idleTimeoutMillis: 30000,
    max: 20, // Increase max connections for better concurrency
});

export const db = drizzle(pool, { schema });
