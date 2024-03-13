import pg from "pg";
import "dotenv/config";

const client = new pg.Client({
  connectionString: process.env.POSTGRES_URL,
});

async function main() {
  try {
    await client.connect();

    const deleteSecretsQuery = `
      DELETE FROM secrets
      WHERE secret_id > 24
      AND created_at <= NOW() - interval '5 minutes';
    `;

    const deleteUsersQuery = `
    DELETE FROM users
    WHERE id > 3
    AND created_at <= NOW() - interval '5 minutes';
    `;

    
    const deleteSecrets = await client.query(deleteSecretsQuery);
    console.log(`${deleteSecrets.rowCount} rows deleted in secrets table.`);
    if (deleteSecrets) {
      const deleteUsers = await client.query(deleteUsersQuery);
      console.log(`${deleteUsers.rowCount} rows deleted in users table.`);
    }
  } catch (error) {
    console.error("Error executing delete query:", error);
  } finally {
    await client.end();
  }
}

main();
