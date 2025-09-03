const express = require('express')
const packageInfo = require('./package.json');
const { getWorkFromId } = require("./dist"); // import compiled TS
const rateLimit = require('express-rate-limit')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
const appVersion = packageInfo.version;

// If you’re behind a proxy (Railway/Render/Heroku/Cloudflare/Nginx/etc.),
// trust it so req.ip uses X-Forwarded-For correctly.
// Use a hop count if you know it (e.g. 1 for single proxy). Fall back to true if unsure.
const PROXY_HOPS = Number(process.env.PROXY_HOPS ?? 1);
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', Number.isFinite(PROXY_HOPS) ? PROXY_HOPS : true);
}

// Get allowed origins from environment variable
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(origin => origin.trim())
  : []

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS policy: ${origin} is not allowed`))
    }
  },
  optionsSuccessStatus: 200
}

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // max 30 requests per minute per IP
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

app.use(limiter)
app.use(cors(corsOptions))
app.use(express.json())

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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))