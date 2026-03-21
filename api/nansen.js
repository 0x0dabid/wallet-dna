module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const nansenPath = req.headers["x-nansen-path"];
  if (!nansenPath) {
    return res.status(400).json({ error: "Missing x-nansen-path header" });
  }

  try {
    const response = await fetch("https://api.nansen.ai" + nansenPath, {
      method: "POST",
      headers: {
        apikey: process.env.NANSEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Nansen proxy error:", err.message);
    res.status(502).json({ error: "Failed to reach Nansen API", detail: err.message });
  }
};
