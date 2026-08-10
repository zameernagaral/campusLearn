require("dotenv").config({ path: "/Users/zameerabdulkalamnagaral/didiii/campuslearn/backend/.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Attendance = require("../models/Attendance");
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");
const Result = require("../models/Result");
const Certificate = require("../models/Certificate");
const { DiscussionPost, Comment } = require("../models/Discussion");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      console.log("Connected to MongoDB Atlas");
      console.log("Seeding dynamic data without deleting existing data...");

      // Fetch sample users and courses
      const students = await User.find({ role: "student" }).limit(5);
      const faculty = await User.find({ role: "faculty" }).limit(2);
      const courses = await Course.find({}).limit(2);

      if (students.length === 0 || faculty.length === 0 || courses.length === 0) {
        console.log("Not enough basic data (students, faculty, courses) to seed dynamic data.");
        process.exit(1);
      }

      const studentIds = students.map(s => s._id);
      const facultyId = faculty[0]._id;
      const courseId = courses[0]._id;

      // 1. Assignments
      const assignment1 = await Assignment.create({
        title: "Introduction to Neural Networks",
        description: "Write a 500-word essay on the history and applications of Neural Networks.",
        course: courseId,
        faculty: facultyId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        totalMarks: 100,
        type: "document",
        status: "published"
      });
      console.log("Inserted Assignment");

      // 2. Submissions
      await Submission.create({
        assignment: assignment1._id,
        student: studentIds[0],
        course: courseId,
        submissionType: "text",
        content: "Neural networks are computing systems inspired by the biological neural networks that constitute animal brains.",
        status: "submitted",
        submittedAt: new Date()
      });
      console.log("Inserted Submission");

      // 3. Attendance
      const attendanceRecords = students.map((student, index) => ({
        student: student._id,
        status: index % 2 === 0 ? "present" : "absent"
      }));
      await Attendance.create({
        course: courseId,
        faculty: facultyId,
        date: new Date(),
        topic: "Machine Learning Basics",
        records: attendanceRecords
      });
      console.log("Inserted Attendance");

      // 4. Quiz
      const quiz1 = await Quiz.create({
        title: "Mid-Term Examination",
        description: "Covers all topics from Week 1 to Week 4.",
        course: courseId,
        faculty: facultyId,
        duration: 30,
        totalMarks: 10,
        passingMarks: 5,
        type: "exam",
        isPublished: true,
        questions: [
          {
            question: "What does HTML stand for?",
            type: "mcq",
            options: [
              { text: "Hyper Text Markup Language", isCorrect: true },
              { text: "High Text Markup Language", isCorrect: false },
              { text: "Hyper Tabular Markup Language", isCorrect: false }
            ],
            marks: 5
          },
          {
            question: "Is Python a compiled language?",
            type: "true_false",
            options: [
              { text: "True", isCorrect: false },
              { text: "False", isCorrect: true }
            ],
            marks: 5
          }
        ]
      });
      console.log("Inserted Quiz");

      // 5. QuizResult
      await QuizResult.create({
        quiz: quiz1._id,
        student: studentIds[0],
        course: courseId,
        score: 10,
        totalMarks: 10,
        percentage: 100,
        passed: true,
        timeTaken: 600,
        answers: [
          { questionId: quiz1.questions[0]._id, selectedOption: "Hyper Text Markup Language", isCorrect: true, marksObtained: 5 },
          { questionId: quiz1.questions[1]._id, selectedOption: "False", isCorrect: true, marksObtained: 5 }
        ]
      });
      console.log("Inserted QuizResult");

      // 6. Result
      await Result.create({
        student: studentIds[0],
        course: courseId,
        semester: 3,
        internalMarks: 45,
        externalMarks: 40,
        totalMarks: 85,
        maxMarks: 100,
        grade: "A+",
        gradePoints: 9,
        status: "pass",
        isPublished: true,
        publishedBy: facultyId,
        publishedAt: new Date()
      });
      console.log("Inserted Result");

      // 7. Certificate
      await Certificate.create({
        student: studentIds[0],
        course: courseId,
        issuedBy: facultyId,
        type: "merit",
        grade: "A+",
        isValid: true
      });
      console.log("Inserted Certificate");

      // 8. Discussion (Post and Comment)
      const post1 = await DiscussionPost.create({
        title: "How to approach the Neural Networks assignment?",
        content: "I'm having some trouble understanding the backward propagation part. Can someone help?",
        author: studentIds[1],
        course: courseId,
        type: "question",
        tags: ["neural networks", "assignment"]
      });
      
      await Comment.create({
        content: "I found this YouTube video really helpful. I'll share the link in the group.",
        author: studentIds[0],
        post: post1._id
      });
      console.log("Inserted Discussion");

      console.log("Dynamic data seeded successfully!");
      process.exit(0);
    } catch (e) {
      console.error("Error:", e);
      process.exit(1);
    }
  });
