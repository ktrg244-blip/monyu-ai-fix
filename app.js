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

    if (!apiRes.ok) {
      console.error("OpenAI error:", JSON.stringify(data));
      return res.json({
        reply: "OpenAI error: " + JSON.stringify(data)
      });
    }

    res.json({
      reply: data.output_text || "OK"
    });

  } catch (e) {
    console.error("Server error:", e);
    res.json({
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
