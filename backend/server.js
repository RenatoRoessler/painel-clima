const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors(),
);

app.get("/status", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
