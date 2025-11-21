const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve index.html

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://bhanubasyan_db_user:WPaaS7gKwpyuxqgB@cluster1.rwapb1j.mongodb.net/registration_db",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas (registration_db)."))
  .catch((err) => console.log(err));


// User Schema
const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  contact: String,
  
});

const User = mongoose.model("User", userSchema);

// Login route
// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Debug: check what is coming from the form
  console.log("Login attempt:", req.body);

  if (!email || !password) {
    return res.status(400).send("<h2>❌ Email and password are required</h2>");
  }

  try {
    // Find user by email
    const allUsers = await User.find();
console.log("All users in DB:", allUsers);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("<h2>❌ User not found</h2>");
    }

    // Check password (plain text for now)
    if (user.password !== password) {
      return res.status(401).send("<h2>❌ Invalid password</h2>");
    }

    // Login successful
    res.send(`
      <h2>✅ Login Successful</h2>
      <h3>User Details:</h3>
      <p><strong>Name:</strong> ${user.fullname}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Contact:</strong> ${user.contact || "N/A"}</p>
      <p><strong>Gender:</strong> ${user.gender || "N/A"}</p>
      <p><strong>Age:</strong> ${user.age || "N/A"}</p>
    `);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("<h2>❌ Error while logging in</h2>");
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
