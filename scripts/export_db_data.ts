import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// Use anon key since we might not have service role.
// NOTE: This means we can only export what is publicly visible or visible to an anon user.
// Tables with restricted RLS won't be fully exported.
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase configuration.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXPORT_DIR = path.resolve(process.cwd(), 'db_export');

async function exportTable(tableName: string) {
    console.log(`📦 Exporting table: ${tableName}...`);

    // Fetch all rows (might fail if RLS prevents it)
    // Pagination loop to get all data
    let allRows: any[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.warn(`⚠️ Could not fully export '${tableName}':`, error.message);
            hasMore = false; // Stop trying this table
        } else {
            if (data && data.length > 0) {
                allRows = [...allRows, ...data];
                if (data.length < pageSize) hasMore = false;
                page++;
            } else {
                hasMore = false;
            }
        }
    }

    if (allRows.length > 0) {
        fs.writeFileSync(
            path.join(EXPORT_DIR, `${tableName}.json`),
            JSON.stringify(allRows, null, 2)
        );
        console.log(`✅ Saved ${allRows.length} rows to ${tableName}.json`);
    } else {
        console.log(`ℹ️ No accessible rows found for ${tableName}.`);
    }
}

async function main() {
    if (!fs.existsSync(EXPORT_DIR)) {
        fs.mkdirSync(EXPORT_DIR);
    }

    const tables = [
        'blogs',
        'products',
        'profiles', // Likely restricted
        'user_roles', // Likely restricted
        'digital_orders', // Likely restricted
        'physical_orders', // Likely restricted
        'subscription_orders', // Likely restricted
        'cart_items' // Likely restricted
    ];

    console.log("🚀 Starting Database Export (Public/Anon View)...");

    for (const table of tables) {
        await exportTable(table);
    }

    console.log("\n🏁 Export completed.");
    console.log(`📂 Check the '${path.basename(EXPORT_DIR)}' directory for JSON files.`);
    console.log("⚠️ Note: Restricted tables (users, orders) may be empty due to Row Level Security (RLS) policies.");
}

main();
