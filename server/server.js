const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Task = require("./routes/Task");
const cors = require("cors");
const User = require("./routes/User");
const authenticateUser = require("./middleware/authMiddleware");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

// Task routes
app.use("/api/tasks", authenticateUser, Task);
app.use("/api/auth", User);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
