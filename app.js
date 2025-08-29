const express = require('express')
const packageInfo = require('./package.json');
const { getWorkFromId } = require("./dist"); // import compiled TS
const { rateLimit } = require('express-rate-limit')

const app = express()
const port = 3000
const appVersion = packageInfo.version;

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // max 30 requests per minute per IP
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})
app.use(limiter)

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