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
const LiveClass = require("../models/LiveClass");
const CalendarEvent = require("../models/CalendarEvent");
const Department = require("../models/Department");

// --- Helper for realistic names ---
const firstNames = ["Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Zameer", "Rohan", "Kabir", "Dhruv", "Ishan", "Krishna", "Rahul", "Dev", "Ananya", "Diya", "Priya", "Neha", "Kavya", "Sneha", "Aditi", "Isha", "Riya", "Aisha", "Meera", "Sara"];
const lastNames = ["Mehta", "Nagaral", "Sharma", "Ahluwalia", "Patel", "Singh", "Reddy", "Kumar", "Gupta", "Desai", "Joshi", "Bhat", "Chopra", "Verma", "Rao", "Nair", "Iyer", "Mukherjee", "Das", "Bose"];

function getRandomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}
function generateEmail(name) {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@campuslearn.edu`;
}

async function seedData() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    console.log("1. Wiping existing database...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    await Attendance.deleteMany({});
    await Quiz.deleteMany({});
    await QuizResult.deleteMany({});
    await Result.deleteMany({});
    await Certificate.deleteMany({});
    await DiscussionPost.deleteMany({});
    await Comment.deleteMany({});
    await LiveClass.deleteMany({});
    await CalendarEvent.deleteMany({});
    await Department.deleteMany({});

    console.log("Collections wiped.");

    // Create a generic department
    const department = await Department.create({
      name: "Computer Science",
      code: "CSE",
      description: "Computer Science and Engineering"
    });

    const credentials = [];

    // --- Admin & HOD ---
    const admin = await User.create({
      name: "Campus Admin",
      email: "admin@campuslearn.edu",
      password: "password123",
      role: "admin",
      isEmailVerified: true
    });
    credentials.push({ Semester: "ALL", Role: "Admin", Name: admin.name, Email: admin.email, Password: "password123" });

    const hod = await User.create({
      name: "Dr. Vikram Singh",
      email: "hod@campuslearn.edu",
      password: "password123",
      role: "hod",
      department: department._id,
      isEmailVerified: true
    });
    credentials.push({ Semester: "ALL", Role: "HOD", Name: hod.name, Email: hod.email, Password: "password123" });

    // Loop through 8 Semesters
    for (let sem = 1; sem <= 8; sem++) {
      console.log(`\n--- Seeding Semester ${sem} ---`);

      // 1. Create Faculty for this semester
      const facultyName = `Dr. ${getRandomName()}`;
      const facultyEmail = generateEmail(facultyName) + `.sem${sem}`;
      const faculty = await User.create({
        name: facultyName,
        email: facultyEmail,
        password: "password123",
        role: "faculty",
        department: department._id,
        isEmailVerified: true,
        designation: "Professor"
      });
      credentials.push({ Semester: sem, Role: "Faculty", Name: faculty.name, Email: faculty.email, Password: "password123" });

      // 2. Create Courses for this semester
      const course1 = await Course.create({
        title: `Semester ${sem} Core Engineering (CS${sem}01)`,
        description: `This is the primary core course for semester ${sem}. Covers foundational engineering principles.`,
        subjectCode: `CS${sem}01`,
        faculty: faculty._id,
        department: department._id,
        semester: sem,
        credits: 4,
        isPublished: true,
        isApproved: true
      });

      const course2 = await Course.create({
        title: `Semester ${sem} Practical Lab (CS${sem}02)`,
        description: `This is the practical laboratory for semester ${sem}. Hands on experiments.`,
        subjectCode: `CS${sem}02`,
        faculty: faculty._id,
        department: department._id,
        semester: sem,
        credits: 2,
        isPublished: true,
        isApproved: true
      });

      faculty.teachingCourses = [course1._id, course2._id];
      await faculty.save();

      // 3. Create Hundreds of Students per semester (30 per sem = 240 total)
      const numStudents = 30;
      const students = [];
      let sampleStudentCredentialsSaved = false;

      // Make sure Arjun Mehta and Zameer Nagaral exist in some semester
      if (sem === 5) {
        const arjun = await User.create({
          name: "Arjun Mehta", email: "arjun.mehta@campuslearn.edu", password: "password123",
          role: "student", department: department._id, semester: sem,
          enrolledCourses: [course1._id, course2._id], isEmailVerified: true
        });
        students.push(arjun);
        credentials.push({ Semester: sem, Role: "Student", Name: arjun.name, Email: arjun.email, Password: "password123" });
        sampleStudentCredentialsSaved = true;

        const zameer = await User.create({
          name: "Zameer Nagaral", email: "zameer.nagaral@campuslearn.edu", password: "password123",
          role: "student", department: department._id, semester: sem,
          enrolledCourses: [course1._id, course2._id], isEmailVerified: true
        });
        students.push(zameer);
      }

      for (let i = students.length; i < numStudents; i++) {
        let studentName = getRandomName();
        // ensure uniqueness of email within script by appending i
        let studentEmail = generateEmail(studentName).replace('@', `${i}.sem${sem}@`);
        
        const student = await User.create({
          name: studentName,
          email: studentEmail,
          password: "password123",
          role: "student",
          department: department._id,
          semester: sem,
          enrolledCourses: [course1._id, course2._id],
          isEmailVerified: true
        });
        students.push(student);

        // Keep 1 sample student for the table for other semesters
        if (!sampleStudentCredentialsSaved) {
          credentials.push({ Semester: sem, Role: "Student", Name: student.name, Email: student.email, Password: "password123" });
          sampleStudentCredentialsSaved = true;
        }
      }

      // Add students to courses
      course1.enrolledStudents = students.map(s => s._id);
      course2.enrolledStudents = students.map(s => s._id);
      await course1.save();
      await course2.save();

      // 4. Create Calendar Event
      await CalendarEvent.create({
        title: `Semester ${sem} Midterm Exam`,
        description: `Midterm examination for Core Engineering CS${sem}01`,
        type: "exam",
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        course: course1._id,
        createdBy: faculty._id
      });

      // 5. Create Live Class
      await LiveClass.create({
        title: `Sem ${sem} Core Live Lecture`,
        description: `Live discussion on chapter 1 for Semester ${sem}`,
        course: course1._id,
        faculty: faculty._id,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        meetingLink: "https://meet.google.com/sst-xvef-rvj",
        status: "scheduled"
      });

      // 6. Create Assignment & Submission
      const assignment = await Assignment.create({
        title: `Sem ${sem} Lab Report 1`,
        description: "Submit your findings for the first practical lab experiment.",
        course: course2._id,
        faculty: faculty._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalMarks: 50,
        type: "document",
        status: "published"
      });

      // Have a few students submit
      for(let k=0; k<5; k++) {
        await Submission.create({
          assignment: assignment._id,
          student: students[k]._id,
          course: course2._id,
          submissionType: "text",
          content: `Here is my completed lab report for CS${sem}02.`,
          status: "submitted",
          submittedAt: new Date()
        });
      }
    }

    console.log("\n--- Seeding Complete ---");
    console.table(credentials);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
