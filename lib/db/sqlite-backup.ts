import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";

const execAsync = util.promisify(exec);

/**
 * Creates a backup of the local SQLite database if it exists.
 * Used for development or fallback environments.
 */
export async function backupSqliteDb() {
  const dbPath = path.resolve(process.cwd(), "dev.db");
  const backupDir = path.resolve(process.cwd(), "backups");
  
  if (!fs.existsSync(dbPath)) {
    console.log("No local SQLite database found at", dbPath);
    return false;
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `dev-backup-${timestamp}.db`);

  try {
    // Basic file copy since SQLite allows copying while running (though ideally use .backup command)
    fs.copyFileSync(dbPath, backupPath);
    console.log(`Database backed up successfully to ${backupPath}`);
    return true;
  } catch (error) {
    console.error("Failed to backup SQLite database:", error);
    return false;
  }
}
