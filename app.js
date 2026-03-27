const express = require("express");

const app = express();

// CORSを許可
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "APIキーが見つからない" });
    }

    const apiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(500).json({
        reply: "OpenAI error: " + JSON.stringify(data)
      });
    }

    res.json({
      reply: data.output_text || "OK"
    });

  } catch (e) {
    res.status(500).json({
      reply: "Server error: " + String(e)
    });
  }
});

app.get("/", (req, res) => {
  res.send("monyu-ai running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
