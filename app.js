const express = require('express')
const packageInfo = require('./package.json');
const { getWorkFromId } = require("./dist"); // import compiled TS

const app = express()
const port = 3000
const appVersion = packageInfo.version;

app.get('/', (req, res) => {
  res.send('AO3 Parser | express.js v' + appVersion)
})

app.get("/work/:id", async (req, res) => {
  try {
    const work = await getWorkFromId(Number(req.params.id));
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`)
})

// const server = app.listen(3000, () =>
//   console.log(`
// 🚀 Server ready at: http://localhost:3000
// ⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
// )
