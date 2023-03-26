const express = require("express");
const { connection } = require("./db");
const { auth } = require("./middleware/auth.middleware");
const { noteRouter } = require("./routes/note.routes");
const { userrouter } = require("./routes/user.routes");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userrouter);

app.use(auth);
app.use("/notes", noteRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Mongodb Connected");
  } catch (error) {}
  console.log(`Server running at port: ${process.env.port}`);
});
