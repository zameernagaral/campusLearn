require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const Attendance = require("./models/Attendance");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    const arjun = await User.findOne({ name: "Arjun Mehta" });
    
    // Find the attendance created by the seeder
    const attendance = await Attendance.findOne({ topic: "Machine Learning Basics" });
    if (attendance) {
      // Check if Arjun is already in it
      const existing = attendance.records.find(r => r.student.toString() === arjun._id.toString());
      if (!existing) {
        attendance.records.push({
          student: arjun._id,
          status: "present"
        });
        await attendance.save();
        console.log("Added Arjun to attendance record.");
      }
    }
    
    process.exit(0);
  });
