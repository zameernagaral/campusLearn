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
  return `${name.toLowerCase().replace(/\s+/g, '.')}`;
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

    const credentials = [];

    // --- Admin ---
    const admin = await User.create({
      name: "Campus Admin",
      email: "admin@campuslearn.edu",
      password: "password123",
      role: "admin",
      isEmailVerified: true
    });
    credentials.push({ Dept: "ALL", Semester: "ALL", Role: "Admin", Name: admin.name, Email: admin.email, Password: "password123" });

    const departmentsData = [
      { name: "Computer Science", code: "CSE", description: "Computer Science and Engineering" },
      { name: "Electronics & Communication", code: "ECE", description: "Electronics and Communication Engineering" },
      { name: "Mechanical Engineering", code: "ME", description: "Mechanical Engineering" }
    ];

    let studentIndex = 0;

    for (const deptData of departmentsData) {
      console.log(`\n================ Seeding Department: ${deptData.code} ================`);
      const department = await Department.create(deptData);

      const hodName = `Dr. ${getRandomName()}`;
      const hod = await User.create({
        name: hodName,
        email: `hod.${deptData.code.toLowerCase()}@campuslearn.edu`,
        password: "password123",
        role: "hod",
        department: department._id,
        isEmailVerified: true
      });
      credentials.push({ Dept: deptData.code, Semester: "ALL", Role: "HOD", Name: hod.name, Email: hod.email, Password: "password123" });

      // Loop through 8 Semesters
      for (let sem = 1; sem <= 8; sem++) {
        console.log(`  --- Seeding Semester ${sem} ---`);

        // 1. Create Faculty for this semester
        const facultyName = `Dr. ${getRandomName()}`;
        const facultyEmail = `${generateEmail(facultyName)}.${deptData.code.toLowerCase()}.sem${sem}@campuslearn.edu`;
        const faculty = await User.create({
          name: facultyName,
          email: facultyEmail,
          password: "password123",
          role: "faculty",
          department: department._id,
          isEmailVerified: true,
          semester: sem,
          designation: "Professor"
        });
        credentials.push({ Dept: deptData.code, Semester: sem, Role: "Faculty", Name: faculty.name, Email: faculty.email, Password: "password123" });

        // 2. Create Courses for this semester
        const course1 = await Course.create({
          title: `Semester ${sem} ${deptData.code} Core Engineering`,
          description: `This is the primary core course for semester ${sem} in ${deptData.code}.`,
          subjectCode: `${deptData.code}${sem}01`,
          faculty: faculty._id,
          department: department._id,
          semester: sem,
          credits: 4,
          isPublished: true,
          isApproved: true
        });

        const course2 = await Course.create({
          title: `Semester ${sem} ${deptData.code} Practical Lab`,
          description: `Practical laboratory for semester ${sem} in ${deptData.code}.`,
          subjectCode: `${deptData.code}${sem}02`,
          faculty: faculty._id,
          department: department._id,
          semester: sem,
          credits: 2,
          isPublished: true,
          isApproved: true
        });

        faculty.teachingCourses = [course1._id, course2._id];
        await faculty.save();

        // Create Dynamic Quizzes for the courses
        await Quiz.create({
          title: `Midterm Exam - ${course1.title}`,
          description: `Comprehensive midterm assessment for ${course1.title}`,
          course: course1._id,
          faculty: faculty._id,
          duration: 60,
          passingMarks: 5,
          isPublished: true,
          type: 'exam',
          questions: [
            {
              question: `What is the primary focus of ${course1.title}?`,
              type: 'mcq',
              options: [
                { text: `Advanced concepts in ${deptData.code}`, isCorrect: true },
                { text: 'General Studies', isCorrect: false },
                { text: 'Basic fundamentals', isCorrect: false },
                { text: 'None of the above', isCorrect: false }
              ],
              marks: 2
            },
            {
              question: `In Semester ${sem}, how many credits is this typical core subject worth?`,
              type: 'mcq',
              options: [
                { text: '4 credits', isCorrect: true },
                { text: '2 credits', isCorrect: false },
                { text: '1 credit', isCorrect: false },
                { text: '6 credits', isCorrect: false }
              ],
              marks: 2
            },
            {
              question: `True or False: ${course1.title} requires prior knowledge from Semester ${sem - 1 || 1}.`,
              type: 'true_false',
              options: [
                { text: 'True', isCorrect: true },
                { text: 'False', isCorrect: false }
              ],
              marks: 1
            },
            {
              question: `Explain the key difference between this Semester ${sem} module and previous semesters.`,
              type: 'short',
              correctAnswer: 'It builds upon fundamental concepts with advanced practical applications.',
              marks: 3
            }
          ]
        });

        // 3. Create Hundreds of Students per semester (30 per sem)
        const numStudents = 30;
        const students = [];
        let sampleStudentCredentialsSaved = false;

        // Ensure Arjun and Zameer exist in CSE Sem 5
        if (deptData.code === "CSE" && sem === 5) {
          const arjun = await User.create({
            name: "Arjun Mehta", email: "arjun.mehta.cse.sem5@campuslearn.edu", password: "password123",
            role: "student", department: department._id, semester: sem,
            enrolledCourses: [course1._id, course2._id], isEmailVerified: true
          });
          students.push(arjun);
          credentials.push({ Dept: deptData.code, Semester: sem, Role: "Student", Name: arjun.name, Email: arjun.email, Password: "password123" });
          sampleStudentCredentialsSaved = true;

          const zameer = await User.create({
            name: "Zameer Nagaral", email: "zameer.nagaral.cse.sem5@campuslearn.edu", password: "password123",
            role: "student", department: department._id, semester: sem,
            enrolledCourses: [course1._id, course2._id], isEmailVerified: true
          });
          students.push(zameer);
        }

        for (let i = students.length; i < numStudents; i++) {
          studentIndex++;
          let studentName = getRandomName();
          let studentEmail = `${generateEmail(studentName)}${studentIndex}.${deptData.code.toLowerCase()}.sem${sem}@campuslearn.edu`;
          
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
            credentials.push({ Dept: deptData.code, Semester: sem, Role: "Student", Name: student.name, Email: student.email, Password: "password123" });
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
          title: `Sem ${sem} ${deptData.code} Midterm Exam`,
          description: `Midterm examination for Core Engineering ${deptData.code}${sem}01`,
          type: "exam",
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          course: course1._id,
          createdBy: faculty._id
        });

        // 5. Create Live Class
        await LiveClass.create({
          title: `Sem ${sem} ${deptData.code} Core Live Lecture`,
          description: `Live discussion on chapter 1 for Semester ${sem}`,
          course: course1._id,
          faculty: faculty._id,
          scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          meetingLink: "https://meet.google.com/sst-xvef-rvj",
          status: "scheduled"
        });

        // 6. Create Assignment & Submission
        const assignment = await Assignment.create({
          title: `Sem ${sem} ${deptData.code} Lab Report 1`,
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
            content: `Here is my completed lab report for ${deptData.code}${sem}02.`,
            status: "submitted",
            submittedAt: new Date()
          });
        }

        // 7. Dynamic Attendance
        const attendanceRecords = students.map(s => ({
          student: s._id,
          status: Math.random() > 0.15 ? 'present' : 'absent',
          remarks: ''
        }));
        await Attendance.create({
          course: course1._id,
          faculty: faculty._id,
          date: new Date(),
          topic: `Introduction to ${course1.title}`,
          records: attendanceRecords
        });

        const topStudent = students[0];
        
        // 8 & 9. Dynamic Results and Certificates for ALL students
        const results = [];
        const certificates = [];
        
        for (const s of students) {
          const internalMarks = Math.floor(Math.random() * 20) + 30; // 30-50
          const externalMarks = Math.floor(Math.random() * 20) + 30; // 30-50
          const totalMarks = internalMarks + externalMarks;
          
          let grade = 'F';
          let gradePoints = 0;
          let status = 'fail';
          if (totalMarks >= 90) { grade = 'O'; gradePoints = 10; status = 'pass'; }
          else if (totalMarks >= 80) { grade = 'A+'; gradePoints = 9; status = 'pass'; }
          else if (totalMarks >= 70) { grade = 'A'; gradePoints = 8; status = 'pass'; }
          else if (totalMarks >= 60) { grade = 'B+'; gradePoints = 7; status = 'pass'; }
          else if (totalMarks >= 50) { grade = 'B'; gradePoints = 6; status = 'pass'; }
          else if (totalMarks >= 40) { grade = 'C'; gradePoints = 5; status = 'pass'; }
          
          results.push({
            student: s._id,
            course: course1._id,
            semester: sem,
            internalMarks,
            externalMarks,
            totalMarks,
            maxMarks: 100,
            grade,
            gradePoints,
            status,
            isPublished: true
          });
          
          if (totalMarks >= 75) {
            certificates.push({
              student: s._id,
              course: course1._id,
              issuedBy: admin._id,
              type: 'merit',
              grade: totalMarks >= 90 ? 'O' : 'A+'
            });
          }
        }
        
        await Result.insertMany(results);
        await Certificate.insertMany(certificates);

        // 10. Dynamic Discussion Post
        const discussionPost = await DiscussionPost.create({
          title: `Discussion for ${course1.title}`,
          content: `Welcome to ${course1.title}! What are your expectations for Semester ${sem} in ${deptData.code}?`,
          author: faculty._id,
          course: course1._id,
          department: department._id,
          tags: [deptData.code, `Sem${sem}`, 'Intro'],
          type: 'discussion'
        });

        await Comment.create({
          content: `I am looking forward to practical applications in this course!`,
          author: topStudent._id,
          post: discussionPost._id
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
