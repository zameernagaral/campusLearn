require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const CalendarEvent = require("./models/CalendarEvent");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const events = await CalendarEvent.find().lean();
  console.log("All Events:", events);

  const arjun = await User.findOne({ name: "Arjun Mehta" }).lean();
  console.log("Arjun Enrolled Courses:", arjun.enrolledCourses);

  process.exit(0);
});
