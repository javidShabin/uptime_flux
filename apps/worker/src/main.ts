export const startWorker = async () => {
  // TODO: bootstrap BullMQ workers
}

startWorker().catch((error) => {
  console.error('Worker failed to start', error)
  process.exit(1)
})

