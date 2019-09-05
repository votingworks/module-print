import makeApp from './app'

const port = process.env.PORT || 3005

makeApp().listen(port, () =>
  process.stdout.write(`module-print listening on port ${port}!\n`)
)
