require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");
const LiveClass = require("./models/LiveClass");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const arjun = await User.findOne({ name: "Arjun Mehta" });
      if (!arjun || !arjun.enrolledCourses || arjun.enrolledCourses.length === 0) {
        console.log("Arjun not found or has no enrolled courses.");
        process.exit(1);
      }
      
      const courseId = arjun.enrolledCourses[0];
      const faculty = await User.findOne({ role: "faculty" });

      await LiveClass.create({
        title: "Introduction to Machine Learning",
        course: courseId,
        faculty: faculty._id,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 60,
        meetingLink: "https://meet.google.com/abc-defg-hij",
        platform: "meet",
        status: "scheduled"
      });
      
      await LiveClass.create({
        title: "Deep Learning Foundations",
        course: courseId,
        faculty: faculty._id,
        scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 90,
        meetingLink: "https://meet.google.com/xyz-uvw-qrs",
        recordingUrl: "https://drive.google.com/file/d/...",
        platform: "meet",
        status: "completed"
      });

      console.log("Live Classes seeded successfully for Arjun's course!");
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
