require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const email = "arjun@campuslearn.com";
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        console.log("User not found in DB");
      } else {
        console.log("User found:", user.email);
        console.log("Is active:", user.isActive);
        const isMatch = await user.matchPassword("Student@123");
        console.log("Password match (Student@123):", isMatch);
        console.log("Role:", user.role);
      }
    } catch (e) {
      console.error("Error:", e.message);
    }
    process.exit(0);
  });
