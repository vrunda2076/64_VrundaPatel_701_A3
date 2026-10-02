const express = require("express");
const axios = require("axios");

const app = express();

// serve frontend
app.use(express.static("public"));

// BACKEND API ROUTE
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city || "Surat";

    // FREE API CALL (no key required)
    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=21.17&longitude=72.83&current_weather=true"
    );

    res.json({
      city: city,
      weather: response.data.current_weather
    });

  } catch (err) {
    res.json({ error: "API failed" });
  }
});

// server start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});