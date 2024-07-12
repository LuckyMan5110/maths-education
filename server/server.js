const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const usersRoute = require("./routes/usersRoute");
const dmas_questionsRoute = require("./routes/dmas_questionsRoute");
const infoRoute = require("./routes/infoRoute");

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use("/users", usersRoute);
app.use("/dmas", dmas_questionsRoute);
app.use("/info", infoRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log("Backend is running....");
});
