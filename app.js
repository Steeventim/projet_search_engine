// app.js
const express = require("express");
// const path = require('path');
// const fs = require('fs');
const cors = require("cors");
const documentRoutes = require("./routes/documentRoutes");
// const documentRoutes = require('./routes/indexRoutes');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/documents", documentRoutes);
// app.use('/api/indices', indexRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
