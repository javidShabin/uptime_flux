export const runSeed = async () => {
  // TODO: seed database with baseline data
}

runSeed().catch((error) => {
  console.error('Failed to seed database', error)
  process.exit(1)
})

