#!/usr/bin/env tsx

/**
 * Migration Script: Mark Existing Users as Verified
 *
 * This script implements a grandfather clause for the email verification system.
 * All existing users will be marked as verified so they don't need to verify
 * their email retroactively.
 *
 * Usage: npx tsx scripts/migrate-existing-users.ts
 */

import { db, pool } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function migrateExistingUsers() {
  console.log("🚀 Starting migration: Mark existing users as verified");
  console.log("━".repeat(60));

  try {
    // Update all users where is_email_verified is false
    const result = await db
      .update(users)
      .set({
        isEmailVerified: true,
      })
      .where(eq(users.isEmailVerified, false))
      .returning({ id: users.id, email: users.email });

    const updateCount = result.length;

    console.log(
      `✅ Successfully updated ${updateCount} user(s) to verified status`,
    );

    if (updateCount > 0) {
      console.log("\nUpdated users:");
      result.forEach((user) => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}`);
      });
    } else {
      console.log(
        "ℹ️  No users needed to be updated (all users already verified)",
      );
    }

    console.log("━".repeat(60));
    console.log("✨ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Error during migration:");
    console.error(error);
    process.exit(1);
  } finally {
    // Close the database connection pool
    await pool.end();
    console.log("🔒 Database connection closed");
  }

  process.exit(0);
}

// Run the migration
migrateExistingUsers();
