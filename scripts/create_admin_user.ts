import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase configuration. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_EMAIL = "info@corporatepranks.com";
const ADMIN_PASSWORD = "Admin123!";

async function createAdmin() {
    console.log(`👑 Creating Admin User: ${ADMIN_EMAIL}...`);

    // 1. Check if user exists (or just try to signup)
    let userId;

    // Try to sign in first to get ID if exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
    });

    if (signInData.user) {
        console.log("ℹ️ User already exists. Using existing ID.");
        userId = signInData.user.id;
    } else {
        // Determine if sign in failed due to invalid login or user not found
        // Just try create user. Service role can use admin.createUser
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: {
                nickname: "Praetorian Admin"
            }
        });

        if (createError) {
            console.error("❌ Error creating user:", createError.message);
            // It might be that the user exists but password was wrong above, let's try to get user by email if possible?
            // Actually admin.listUsers is better but let's assume if create fails and signin failed, we might have an issue.
            // But typically "User already registered" is the error.
            if (createError.message.includes("already registered")) {
                // We can't easily get the ID without signing in if we don't have the password, 
                // but we have the service role key, so we can list users.
                const { data: users } = await supabase.auth.admin.listUsers();
                const user = users.users.find(u => u.email === ADMIN_EMAIL);
                if (user) {
                    userId = user.id;
                    console.log("ℹ️ Found existing user ID via admin list.");
                } else {
                    process.exit(1);
                }
            } else {
                process.exit(1);
            }
        } else {
            userId = userData.user.id;
            console.log("✅ User created.");
        }
    }

    if (!userId) {
        console.error("❌ Could not obtain User ID.");
        process.exit(1);
    }

    // 2. Assign Admin Role
    console.log(`⚔️ Assigning 'admin' role to ${userId}...`);

    // Check if role already exists
    const { data: existingRoles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin');

    if (existingRoles && existingRoles.length > 0) {
        console.log("ℹ️ User is already an admin.");
    } else {
        const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
                user_id: userId,
                role: 'admin'
            });

        if (roleError) {
            console.error("❌ Error assigning role:", roleError.message);
        } else {
            console.log("✅ Admin role assigned successfully!");
        }
    }

    // 3. Update Profile citizen tier to 'consul' for flair
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ citizen_tier: 'consul', nickname: 'Praetorian Admin' })
        .eq('id', userId);

    if (profileError) {
        console.warn("⚠️ Could not update profile tier (non-critical):", profileError.message);
    } else {
        console.log("✅ Profile updated to Consul tier.");
    }
}

createAdmin();
