require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const arjun = await User.findOne({ name: "Arjun Mehta" });
      const priya = await User.findOne({ name: "Prof. Priya Sharma" });
      const admin = await User.findOne({ name: "System Administrator" });

      console.log("Arjun email:", arjun ? arjun.email : "Not found");
      console.log("Priya email:", priya ? priya.email : "Not found");
      console.log("Admin email:", admin ? admin.email : "Not found");
      
    } catch (e) {
      console.error("Error:", e.message);
    }
    process.exit(0);
  });
