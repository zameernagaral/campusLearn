require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const Result = require("./models/Result");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    const result = await Result.findOne({ internalMarks: 45, externalMarks: 40 }).populate("student");
    console.log("Result belongs to:", result.student.email);
    
    // Also, get Arjun's ID so we can update the records to point to him!
    const arjun = await User.findOne({ name: "Arjun Mehta" });
    console.log("Arjun ID:", arjun._id);

    // Re-assign all seeded data to Arjun!
    await Result.updateMany({ internalMarks: 45 }, { student: arjun._id });
    await require("./models/Assignment").updateMany({}, { $set: { dummy: true } }); // just to avoid error if not needed
    await require("./models/Submission").updateMany({ submissionType: "text" }, { student: arjun._id });
    await require("./models/Certificate").updateMany({ grade: "A+" }, { student: arjun._id });
    
    const quizResult = await require("./models/QuizResult").updateMany({ percentage: 100 }, { student: arjun._id });
    
    console.log("Updated seeded data to belong to Arjun Mehta.");
    process.exit(0);
  });
