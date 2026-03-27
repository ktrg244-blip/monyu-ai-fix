const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// ★ここに直接入れる（環境変数やめる）
const OPENAI_API_KEY = "sk-proj-ここに貼る";

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await apiRes.json();

    if (!data.choices) {
      return res.status(500).json({ reply: "APIエラー" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ reply: "サーバーエラー" });
  }
});

app.listen(3000, () => {
  console.log("monyu-ai running");
});
