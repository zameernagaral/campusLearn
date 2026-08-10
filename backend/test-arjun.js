require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const arjun = await User.findOne({ name: "Arjun Mehta" });
      if (arjun) {
        console.log("Arjun's new email is:", arjun.email);
        
        // Let's restore the original demo users to their @campuslearn.com addresses
        arjun.email = "arjun@campuslearn.com";
        await arjun.save();
        console.log("Restored Arjun's email to arjun@campuslearn.com");
      }
      
      const priya = await User.findOne({ name: "Prof. Priya Sharma" });
      if (priya) {
        priya.email = "priya@campuslearn.com";
        await priya.save();
        console.log("Restored Priya's email to priya@campuslearn.com");
      }
      
      const hod = await User.findOne({ name: "Dr. Rajesh Kumar" });
      if (hod) {
        hod.email = "hod@campuslearn.com";
        await hod.save();
        console.log("Restored HOD's email to hod@campuslearn.com");
      }
      
    } catch (e) {
      console.error("Error:", e.message);
    }
    process.exit(0);
  });
