require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");
const Course = require("./models/Course");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const arjun = await User.findOne({ name: "Arjun Mehta" });
  const courseToEnroll = "6a7a0b2608065fbed873d53c";
  
  if (!arjun.enrolledCourses.includes(courseToEnroll)) {
    arjun.enrolledCourses.push(courseToEnroll);
    await arjun.save();
    console.log("Enrolled Arjun in the correct course!");
  } else {
    console.log("Already enrolled.");
  }
  
  // Also verify that the course has Arjun in its students array
  const course = await Course.findById(courseToEnroll);
  if (course && !course.students.includes(arjun._id)) {
    course.students.push(arjun._id);
    await course.save();
    console.log("Added Arjun to Course students array.");
  }

  process.exit(0);
});
