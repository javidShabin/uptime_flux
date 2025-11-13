export const runMigrations = async () => {
  // TODO: run database migrations
}

runMigrations().catch((error) => {
  console.error('Failed to run migrations', error)
  process.exit(1)
})

