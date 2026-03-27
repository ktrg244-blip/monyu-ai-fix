const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const OPENAI_API_KEY = "sk-proj-ここに自分のキー";

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

    res.json({
      reply: data.choices?.[0]?.message?.content || "返答なし"
    });

  } catch (err) {
    res.status(500).json({
      reply: "サーバーエラー: " + String(err)
    });
  }
});

app.get("/", (req, res) => {
  res.send("monyu-ai running");
});

app.listen(3000, () => {
  console.log("Server running");
});
