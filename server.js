require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const NANSEN_API_KEY = process.env.NANSEN_API_KEY;
const NANSEN_BASE = "https://api.nansen.ai";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Proxy endpoint — forwards POST requests to Nansen API
app.post("/api/nansen/*", async (req, res) => {
  const nansenPath = "/" + req.params[0];
  try {
    const response = await fetch(NANSEN_BASE + nansenPath, {
      method: "POST",
      headers: {
        apikey: NANSEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Nansen proxy error:", err.message);
    res.status(502).json({ error: "Failed to reach Nansen API" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Wallet DNA server running on http://localhost:${PORT}`);
});
