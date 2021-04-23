const express = require('express')
const app = express()
const port = process.argv[2] || 80

app.use(express.static(`${__dirname}/www`))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}, CTRL + C to shutdown`)
})
