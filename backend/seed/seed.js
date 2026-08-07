const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const Announcement = require('../models/Announcement');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
      Assignment.deleteMany({}),
      Announcement.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ─── Departments ──────────────────────────────────────────────────────────
    const departments = await Department.insertMany([
      { name: 'Computer Science Engineering', code: 'CSE', description: 'Department of CSE' },
      { name: 'Electronics & Communication', code: 'ECE', description: 'Department of ECE' },
      { name: 'Mechanical Engineering', code: 'MECH', description: 'Department of MECH' },
      { name: 'Civil Engineering', code: 'CIVIL', description: 'Department of CIVIL' },
    ]);
    console.log('✅ Departments seeded');

    const cseDept = departments[0];
    const eceDept = departments[1];

    // ─── Users ────────────────────────────────────────────────────────────────
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@campuslearn.com',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    });

    const hodUser = await User.create({
      name: 'Dr. Rajesh Kumar',
      email: 'hod@campuslearn.com',
      password: 'Hod@1234',
      role: 'hod',
      department: cseDept._id,
      employeeId: 'HOD001',
      designation: 'Professor & Head',
      isEmailVerified: true,
      isActive: true,
    });

    const facultyUsers = await User.create([
      {
        name: 'Prof. Priya Sharma',
        email: 'priya@campuslearn.com',
        password: 'Faculty@123',
        role: 'faculty',
        department: cseDept._id,
        employeeId: 'FAC001',
        designation: 'Associate Professor',
        bio: 'Expert in Data Structures and Algorithms with 10 years of teaching experience.',
        isEmailVerified: true,
        isActive: true,
      },
      {
        name: 'Prof. Amit Verma',
        email: 'amit@campuslearn.com',
        password: 'Faculty@123',
        role: 'faculty',
        department: cseDept._id,
        employeeId: 'FAC002',
        designation: 'Assistant Professor',
        bio: 'Machine Learning researcher with publications in top conferences.',
        isEmailVerified: true,
        isActive: true,
      },
    ]);

    const studentUsers = await User.create([
      {
        name: 'Arjun Mehta',
        email: 'arjun@campuslearn.com',
        password: 'Student@123',
        role: 'student',
        department: cseDept._id,
        rollNumber: 'CSE2024001',
        semester: 5,
        year: 3,
        points: 850,
        streak: 12,
        badges: ['quick_learner', 'first_quiz'],
        isEmailVerified: true,
        isActive: true,
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@campuslearn.com',
        password: 'Student@123',
        role: 'student',
        department: cseDept._id,
        rollNumber: 'CSE2024002',
        semester: 5,
        year: 3,
        points: 920,
        streak: 15,
        badges: ['top_performer', 'quiz_master'],
        isEmailVerified: true,
        isActive: true,
      },
      {
        name: 'Rahul Gupta',
        email: 'rahul@campuslearn.com',
        password: 'Student@123',
        role: 'student',
        department: cseDept._id,
        rollNumber: 'CSE2024003',
        semester: 3,
        year: 2,
        points: 650,
        streak: 7,
        badges: ['consistent_learner'],
        isEmailVerified: true,
        isActive: true,
      },
    ]);

    // Update dept HOD
    await Department.findByIdAndUpdate(cseDept._id, {
      hod: hodUser._id,
      totalStudents: 3,
      totalFaculty: 2,
    });

    console.log('✅ Users seeded');

    // ─── Courses ──────────────────────────────────────────────────────────────
    const dsaCourse = await Course.create({
      title: 'Data Structures & Algorithms',
      description: 'Master the fundamentals of data structures and algorithmic problem solving. This course covers arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming.',
      shortDescription: 'Master DSA from basics to advanced level.',
      faculty: facultyUsers[0]._id,
      department: cseDept._id,
      semester: 5,
      credits: 4,
      subjectCode: 'CS501',
      isPublished: true,
      isApproved: true,
      approvedBy: hodUser._id,
      level: 'intermediate',
      tags: ['algorithms', 'data structures', 'programming', 'computer science'],
      learningOutcomes: [
        'Understand fundamental data structures',
        'Analyze algorithm complexity',
        'Solve competitive programming problems',
        'Design efficient algorithms',
      ],
      rating: 4.8,
      totalRatings: 45,
      enrolledStudents: studentUsers.map(s => s._id),
    });

    const mlCourse = await Course.create({
      title: 'Machine Learning Fundamentals',
      description: 'A comprehensive introduction to machine learning concepts, algorithms, and practical applications using Python and scikit-learn.',
      shortDescription: 'Learn ML from scratch with hands-on projects.',
      faculty: facultyUsers[1]._id,
      department: cseDept._id,
      semester: 6,
      credits: 4,
      subjectCode: 'CS601',
      isPublished: true,
      isApproved: true,
      approvedBy: hodUser._id,
      level: 'advanced',
      tags: ['machine learning', 'python', 'ai', 'data science'],
      learningOutcomes: [
        'Understand supervised and unsupervised learning',
        'Implement ML algorithms from scratch',
        'Work with real datasets',
        'Build ML pipelines',
      ],
      rating: 4.9,
      totalRatings: 38,
      enrolledStudents: [studentUsers[0]._id, studentUsers[1]._id],
    });

    // Update enrolled courses for students
    await Promise.all(
      studentUsers.map(s => User.findByIdAndUpdate(s._id, { enrolledCourses: [dsaCourse._id] }))
    );
    await User.findByIdAndUpdate(studentUsers[0]._id, { $addToSet: { enrolledCourses: mlCourse._id } });
    await User.findByIdAndUpdate(studentUsers[1]._id, { $addToSet: { enrolledCourses: mlCourse._id } });

    // Update faculty teaching courses
    await User.findByIdAndUpdate(facultyUsers[0]._id, { teachingCourses: [dsaCourse._id] });
    await User.findByIdAndUpdate(facultyUsers[1]._id, { teachingCourses: [mlCourse._id] });

    console.log('✅ Courses seeded');

    // ─── Modules & Lessons for DSA ────────────────────────────────────────────
    const mod1 = await Module.create({
      title: 'Module 1: Arrays & Strings',
      description: 'Foundation of data structures',
      course: dsaCourse._id,
      order: 1,
      isPublished: true,
    });

    const mod2 = await Module.create({
      title: 'Module 2: Linked Lists',
      description: 'Singly, Doubly, and Circular linked lists',
      course: dsaCourse._id,
      order: 2,
      isPublished: true,
    });

    const lesson1 = await Lesson.create({
      title: 'Introduction to Arrays',
      description: 'Learn about arrays, their properties, and basic operations.',
      module: mod1._id,
      course: dsaCourse._id,
      order: 1,
      type: 'video',
      duration: 1800,
      isPublished: true,
      isFree: true,
      views: 120,
    });

    const lesson2 = await Lesson.create({
      title: 'Array Operations & Time Complexity',
      description: 'Deep dive into array operations and Big O notation.',
      module: mod1._id,
      course: dsaCourse._id,
      order: 2,
      type: 'video',
      duration: 2400,
      isPublished: true,
      views: 98,
    });

    const lesson3 = await Lesson.create({
      title: 'Arrays - Study Notes',
      description: 'Comprehensive notes on array concepts.',
      module: mod1._id,
      course: dsaCourse._id,
      order: 3,
      type: 'document',
      isPublished: true,
    });

    await Module.findByIdAndUpdate(mod1._id, { lessons: [lesson1._id, lesson2._id, lesson3._id] });
    await Module.findByIdAndUpdate(mod2._id, { lessons: [] });
    await Course.findByIdAndUpdate(dsaCourse._id, {
      modules: [mod1._id, mod2._id],
      totalLessons: 3,
    });

    console.log('✅ Modules & Lessons seeded');

    // ─── Quiz ─────────────────────────────────────────────────────────────────
    const quiz = await Quiz.create({
      title: 'Arrays & Complexity Quiz',
      description: 'Test your knowledge of arrays and time complexity.',
      course: dsaCourse._id,
      faculty: facultyUsers[0]._id,
      duration: 30,
      passingMarks: 6,
      isPublished: true,
      showResults: true,
      questions: [
        {
          question: 'What is the time complexity of accessing an element in an array by index?',
          type: 'mcq',
          options: [
            { text: 'O(1)', isCorrect: true },
            { text: 'O(n)', isCorrect: false },
            { text: 'O(log n)', isCorrect: false },
            { text: 'O(n²)', isCorrect: false },
          ],
          explanation: 'Arrays provide O(1) random access since elements are stored contiguously in memory.',
          marks: 2,
        },
        {
          question: 'Which sorting algorithm has the best average-case time complexity?',
          type: 'mcq',
          options: [
            { text: 'Bubble Sort', isCorrect: false },
            { text: 'Merge Sort', isCorrect: true },
            { text: 'Selection Sort', isCorrect: false },
            { text: 'Insertion Sort', isCorrect: false },
          ],
          explanation: 'Merge Sort has O(n log n) average and worst-case complexity.',
          marks: 2,
        },
        {
          question: 'Arrays in most languages have fixed size.',
          type: 'true_false',
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false },
          ],
          explanation: 'Static arrays have fixed sizes, though dynamic arrays can resize.',
          marks: 1,
        },
      ],
    });

    console.log('✅ Quiz seeded');

    // ─── Assignment ───────────────────────────────────────────────────────────
    const tomorrow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Assignment.create({
      title: 'Implement a Binary Search Tree',
      description: 'Implement a complete BST with insert, delete, search, and traversal operations. Submit your solution as a ZIP file with code and documentation.',
      course: dsaCourse._id,
      faculty: facultyUsers[0]._id,
      dueDate: tomorrow,
      maxMarks: 100,
      isPublished: true,
      allowLateSubmission: false,
    });

    console.log('✅ Assignment seeded');

    // ─── Announcements ────────────────────────────────────────────────────────
    await Announcement.insertMany([
      {
        title: '🎉 Welcome to CampusLearn Semester 5!',
        content: 'Dear students and faculty, welcome to the new semester on CampusLearn. All course materials have been uploaded. Please check your enrolled courses and start your learning journey!',
        author: adminUser._id,
        targetAudience: 'all',
        priority: 'high',
        isActive: true,
      },
      {
        title: '📅 Mid-Semester Examinations Schedule',
        content: 'The mid-semester examinations are scheduled for next month. Please prepare accordingly and check the detailed timetable in your calendar.',
        author: hodUser._id,
        targetAudience: 'students',
        priority: 'urgent',
        department: cseDept._id,
        isActive: true,
      },
    ]);

    console.log('✅ Announcements seeded');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('Demo Credentials:');
    console.log('─────────────────');
    console.log('Admin:   admin@campuslearn.com  / Admin@123');
    console.log('HOD:     hod@campuslearn.com    / Hod@1234');
    console.log('Faculty: priya@campuslearn.com  / Faculty@123');
    console.log('Student: arjun@campuslearn.com  / Student@123');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
