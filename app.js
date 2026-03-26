const express = require("express");

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

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

    res.json({
      reply: data.output_text || "OK"
    });

  } catch (e) {
    res.json({ reply: "error" });
  }
});

app.get("/", (req, res) => {
  res.send("monyu-ai running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
